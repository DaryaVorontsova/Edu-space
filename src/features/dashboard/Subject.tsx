import React, { useState } from 'react';
import axios from 'axios';
import { BASE_API_URL } from '../../config';
import { logErrorToService } from '../../services/errorLogger';
import { useNavigate } from 'react-router-dom';
import { EditButton } from '../../components/EditButton';
import { DeleteButton } from '../../components/DeleteButton';
import { EditModal } from '../../components/EditModal';
import { ConfirmModal } from '../../components/ConfirmModal';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { selectAccessToken } from '../login/selectors';
import { updateSubject } from './dashboardSlice';
import { removeSubject } from './dashboardSlice';
import { PermissionsWrapper } from '../permissions/PermissionsWrapper';

interface SubjectProps {
  id: string;
  name: string;
  teacherName: string;
}

export const Subject: React.FC<SubjectProps> = ({ id, name, teacherName }) => {
  const navigate = useNavigate();
  const accessToken = useAppSelector(selectAccessToken);
  const dispatch = useAppDispatch();
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editedName, setEditedName] = useState(name);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [errorDelete, setErrorDelete] = useState<string | null>(null);

  const handleNavigate = () => {
    navigate(`/dashboard/subject/${id}`);
  };

  const changeShowEditModal = (value: boolean) => {
    setShowEditModal(value);
    setEditedName(name);
  };

  const handleEdit = async () => {
    if (!id) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      await axios.patch(
        `${BASE_API_URL}/subject/${id}/edit-title`,
        { title: editedName },
        {
          headers: {
            Authorization: accessToken,
          },
        },
      );
      dispatch(
        updateSubject({ id, name: editedName, description: '', teacherName }),
      );
    } catch (error) {
      setError('Error editing subject name');
      logErrorToService(error, { context: 'patchEditingSubjectDescription' });
    } finally {
      setLoading(false);
      setShowEditModal(false);
    }
  };

  const handleSubjectDelete = async () => {
    try {
      setLoadingDelete(true);

      await axios.delete(`${BASE_API_URL}/subject/delete/${id}`, {
        headers: {
          Authorization: accessToken,
        },
      });
      dispatch(removeSubject(id));
    } catch (error) {
      setErrorDelete('Failed to delete student');
      logErrorToService(error, { context: 'deleteSubject' });
    } finally {
      setShowDeleteModal(false);
    }
  };

  return (
    <>
      <div className="col" style={{ maxWidth: '270px', height: 'auto' }}>
        <div className="card shadow-sm h-100">
          <div className="d-flex align-items-center justify-content-center">
            <img
              src="/education.svg"
              alt="Subject"
              style={{ width: '170px' }}
            />
          </div>
          <div className="card-body">
            <div className="d-flex flex-row align-items-center justify-content-center">
              <h4 className="card-text text-center me-2 subject-title">
                {name}
              </h4>
              <PermissionsWrapper permission="EditButtonSubject">
                <EditButton onClick={() => changeShowEditModal(true)} />
              </PermissionsWrapper>
              <PermissionsWrapper permission="DeleteButtonSubject">
                <DeleteButton onClick={() => setShowDeleteModal(true)} />
              </PermissionsWrapper>
            </div>
            <p className="card-text text-center">{teacherName}</p>
            <div className="d-flex justify-content-center align-items-center">
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleNavigate}
              >
                Перейти
              </button>
            </div>
          </div>
        </div>
      </div>

      <EditModal
        show={showEditModal}
        onClose={() => changeShowEditModal(false)}
        title="Редактирование название предмета"
        fields={[
          {
            label: 'Название предмета',
            value: editedName,
            onChange: setEditedName,
          },
        ]}
        loading={loading}
        onSave={handleEdit}
      />

      {error && (
        <p className="text-danger text-center">
          Ошибка редактирования названия предмета. Попробуйте снова
        </p>
      )}

      <ConfirmModal
        show={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Удаление предмета"
        body="Вы уверены, что хотите удалить этот предмет?"
        onConfirm={handleSubjectDelete}
        loading={loadingDelete}
      />

      {errorDelete && (
        <p className="text-danger text-center">
          Ошибка удаления предмета. Попробуйте снова
        </p>
      )}
    </>
  );
};
