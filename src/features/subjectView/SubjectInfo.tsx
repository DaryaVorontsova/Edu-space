import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { logErrorToService } from '../../services/errorLogger';
import { EditButton } from '../../components/EditButton';
import { PermissionsWrapper } from '../permissions/PermissionsWrapper';
import { useAppSelector } from '../../app/hooks';
import { selectAccessToken } from '../login/selectors';
import { BASE_API_URL } from '../../config';
import { EditModal } from '../../components/EditModal';

interface InfoProps {
  subjectId: string | undefined;
  name: string;
  teacherName: string;
  description: string;
}

export const SubjectInfo: React.FC<InfoProps> = ({
  subjectId,
  name,
  teacherName,
  description,
}) => {
  const accessToken = useAppSelector(selectAccessToken);

  const [showModal, setShowModal] = useState(false);
  const [editedDescription, setEditedDescription] = useState(description);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setEditedDescription(description);
  }, [description]);

  const changeShowEditModal = (value: boolean) => {
    setShowModal(value);
    setEditedDescription(description);
  };

  const handleEdit = async () => {
    if (!subjectId) {
      return;
    }

    const updatedDescription = {
      description: editedDescription,
    };

    try {
      setLoading(true);

      await axios.patch(
        `${BASE_API_URL}/subject/${subjectId}/edit-description`,
        updatedDescription,
        {
          headers: {
            Authorization: accessToken,
          },
        },
      );
    } catch (error) {
      setError('Error editing subject description');
      logErrorToService(error, { context: 'patchEditingSubjectDescription' });
    } finally {
      setLoading(false);
      setShowModal(false);
    }
  };

  return (
    <>
      <h4 className="text-center">{name}</h4>
      <div className="subject-info d-flex align-items-center mb-3">
        <img
          src="/education.svg"
          alt="Subject"
          className="me-3"
          style={{ width: '170px' }}
        />
        <div className="card-text">
          <p>
            <strong>Преподаватель:</strong> {teacherName}
          </p>
          <div className="d-flex flex-row align-items-center gap-2">
            <PermissionsWrapper permission="EditButton">
              <EditButton onClick={() => changeShowEditModal(true)} />
            </PermissionsWrapper>
            <p className="mb-0">
              <strong>Описание предмета:</strong> {editedDescription}
            </p>
          </div>
        </div>
      </div>

      <EditModal
        show={showModal}
        onClose={() => changeShowEditModal(false)}
        title="Редактирование описания предмета"
        fields={[
          {
            label: 'Описание предмета',
            value: editedDescription,
            onChange: setEditedDescription,
          },
        ]}
        loading={loading}
        onSave={handleEdit}
      />

      {error && (
        <p className="text-danger mt-3">
          Ошибка редактирования описания предмета. Попробуйте снова
        </p>
      )}
    </>
  );
};
