import React, { useState } from 'react';
import axios from 'axios';
import { logErrorToService } from '../../services/errorLogger';
import { useNavigate } from 'react-router-dom';
import { EditButton } from '../../components/EditButton';
import { DeleteButton } from '../../components/DeleteButton';
import { BASE_API_URL } from '../../config';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { selectAccessToken } from '../login/selectors';
import { ConfirmModal } from '../../components/ConfirmModal';
import { EditModal } from '../../components/EditModal';
import { PermissionsWrapper } from '../permissions/PermissionsWrapper';
import { removeAssignment } from './subjectViewSlice';
import { updateAssignment } from './subjectViewSlice';

interface AssignmentProps {
  subjectId: string | undefined;
  id: string;
  title: string;
  description: string;
  deadline: string;
}

export const Assignment: React.FC<AssignmentProps> = ({
  subjectId,
  id,
  title,
  description,
  deadline,
}) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const accessToken = useAppSelector(selectAccessToken);

  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);
  const [editedDescription, setEditedDescription] = useState(description);
  const [editedDeadline, setEditedDeadline] = useState(
    new Date(deadline).toISOString().slice(0, 16),
  );
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [errorDelete, setErrorDelete] = useState<string | null>(null);
  const [loadingEdit, setLoadingEdit] = useState(false);
  const [errorEdit, setErrorEdit] = useState<string | null>(null);

  const handleNavigate = () => {
    navigate(`/dashboard/subject/${subjectId}/assignments/${id}`);
  };

  const handleEdit = async () => {
    if (!subjectId || !id) {
      return;
    }

    try {
      setErrorEdit(null);
      setLoadingEdit(true);

      const deadlineTimestamp = new Date(editedDeadline).getTime() / 1000;

      const response = await axios.patch(
        `${BASE_API_URL}/assignments/${id}/edit`,
        {
          title: editedTitle,
          description: editedDescription,
          deadline: deadlineTimestamp,
        },
        {
          headers: {
            Authorization: accessToken,
            'Content-Type': 'application/json',
          },
        },
      );

      dispatch(
        updateAssignment({
          assignmentId: id,
          title: response.data.updatedFields.title,
          description: response.data.updatedFields.description,
          deadline: response.data.updatedFields.deadline,
        }),
      );
    } catch (error) {
      setErrorEdit('Error editing assignment');
      logErrorToService(error, { context: 'patchEditingAssignment' });
    } finally {
      setLoadingEdit(false);
      setShowEditModal(false);
    }
  };

  const openDeleteModal = () => {
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
  };

  const changeShowEditModal = (value: boolean) => {
    setShowEditModal(value);
    setEditedTitle(title);
    setEditedDescription(description);
    setEditedDeadline(new Date(deadline).toISOString().slice(0, 16));
  };

  const handleDelete = async () => {
    try {
      setLoadingDelete(true);

      await axios.delete(
        `${BASE_API_URL}/subject/${subjectId}/assignments/${id}`,
        {
          headers: {
            Authorization: accessToken,
          },
        },
      );
      dispatch(removeAssignment(id));
    } catch (error) {
      setErrorDelete('Failed to delete student');
      logErrorToService(error, { context: 'deleteAssignment' });
    } finally {
      setLoadingDelete(false);
      closeDeleteModal();
    }
  };

  const formattedDeadline = new Date(deadline).toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <>
      <div className="d-flex flex-column flex-md-row justify-content-center align-items-center gap-3 mb-2 text-center">
        <h6 className="p-2 title">{title}</h6>
        <div className="d-flex flex-row justify-content-center align-items-center gap-2 mb-2">
          <button className="btn btn-primary btn-sm" onClick={handleNavigate}>
            Перейти
          </button>
          <div>
            <PermissionsWrapper permission="EditButton">
              <EditButton onClick={() => changeShowEditModal(true)} />
            </PermissionsWrapper>
            <PermissionsWrapper permission="DeleteButton">
              <DeleteButton onClick={() => openDeleteModal()} />
            </PermissionsWrapper>
          </div>
        </div>
      </div>
      <div className="d-flex justify-content-center align-items-center flex-column">
        <p className="text-muted">
          <strong>Описание задания: </strong>
          {description}
        </p>
        <p className="text-muted">
          <strong>Дедлайн: </strong>
          {formattedDeadline}
        </p>
      </div>

      <EditModal
        show={showEditModal}
        onClose={() => changeShowEditModal(false)}
        title="Редактирование задания"
        fields={[
          {
            label: 'Название задания',
            value: editedTitle,
            onChange: setEditedTitle,
          },
          {
            label: 'Описание задания',
            value: editedDescription,
            onChange: setEditedDescription,
          },
          {
            label: 'Дедлайн задания',
            value: editedDeadline,
            onChange: setEditedDeadline,
          },
        ]}
        loading={loadingEdit}
        onSave={handleEdit}
      />

      {errorEdit && (
        <p className="text-danger text-center">
          Ошибка редактирования задания. Попробуйте снова
        </p>
      )}

      <ConfirmModal
        show={showDeleteModal}
        onClose={closeDeleteModal}
        onConfirm={handleDelete}
        loading={loadingDelete}
        title="Подтверждение удаления"
        body="Вы уверены, что хотите удалить это задание?"
      />

      {errorDelete && (
        <p className="text-dander text-center">
          Ошибка удаления задания. Попробуйте снова
        </p>
      )}
    </>
  );
};
