import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { logErrorToService } from '../../services/errorLogger';
import { EditModal } from '../../components/EditModal';
import { ConfirmModal } from '../../components/ConfirmModal';
import { DeleteButton } from '../../components/DeleteButton';
import { BASE_API_URL } from '../../config';
import { useAppSelector } from '../../app/hooks';
import { selectAccessToken } from '../login/selectors';

interface SubmissionProps {
  name: string;
  answer: string;
  submissionId: string;
  grade: string | null;
  feedback: string | null;
}

export const Submission: React.FC<SubmissionProps> = ({
  name,
  answer,
  submissionId,
  grade: initialGrade,
  feedback: initialFeedback,
}) => {
  const accessToken = useAppSelector(selectAccessToken);

  const [grade, setGrade] = useState(initialGrade || '');
  const [isGradeExist, setIsGradeExist] = useState(false);
  const [comment, setComment] = useState(initialFeedback || '');
  const [showEvaluateModal, setShowEvaluateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loadingEvaluate, setLoadingEvaluate] = useState(false);
  const [errorEvaluate, setErrorEvaluate] = useState<string | null>(null);
  const [loadingEdit, setLoadingEdit] = useState(false);
  const [errorEdit, setErrorEdit] = useState<string | null>(null);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [errorDelete, setErrorDelete] = useState<string | null>(null);

  useEffect(() => {
    setIsGradeExist(initialGrade !== null && initialFeedback !== null);
  }, [initialGrade, initialFeedback]);

  const handleOpenEvaluateModal = () => setShowEvaluateModal(true);
  const handleCloseEvaluateModal = () => setShowEvaluateModal(false);
  const handleOpenEditModal = () => setShowEditModal(true);
  const handleCloseEditModal = () => setShowEditModal(false);
  const handleOpenDeleteModal = () => setShowDeleteModal(true);
  const handleCloseDeleteModal = () => setShowDeleteModal(false);

  const handleEdit = async () => {
    const editSubmission = async (grade: string, feedback: string) => {
      try {
        setErrorEdit(null);
        setLoadingEdit(true);

        const payload = { grade, feedback };

        await axios.patch(
          `${BASE_API_URL}/submissions/${submissionId}/mark/edit`,
          payload,
          {
            headers: {
              Authorization: accessToken,
              'Content-Type': 'application/json',
            },
          },
        );

        setGrade(grade);
        setComment(feedback);
        setIsGradeExist(true);
      } catch (error) {
        setErrorEdit('Editing grade error');
        logErrorToService(error, { context: 'patchEditingGrade' });
      } finally {
        setLoadingEdit(false);
        handleCloseEditModal();
      }
    };

    editSubmission(grade, comment);
  };

  const handleEvaluate = async () => {
    const evaluateSubmission = async (grade: string, feedback: string) => {
      try {
        setErrorEvaluate(null);
        setLoadingEvaluate(true);

        const payload = { grade, feedback };

        await axios.post(
          `${BASE_API_URL}/submissions/${submissionId}/mark/add`,
          payload,
          {
            headers: {
              Authorization: accessToken,
              'Content-Type': 'application/json',
            },
          },
        );

        setIsGradeExist(true);
      } catch (error) {
        setErrorEvaluate('Adding mark error');
        logErrorToService(error, { context: 'creatingMark' });
      } finally {
        setLoadingEvaluate(false);
        handleCloseEvaluateModal();
      }
    };

    evaluateSubmission(grade, comment);
  };

  const handleDelete = async () => {
    const submissionDeletion = async () => {
      try {
        setErrorDelete(null);
        setLoadingDelete(true);

        await axios.delete(`${BASE_API_URL}/submissions/${submissionId}/mark`, {
          headers: {
            Authorization: accessToken,
          },
        });

        setIsGradeExist(false);
        setGrade('');
        setComment('');
      } catch (error) {
        setErrorDelete('Deleting mark error');
        logErrorToService(error, { context: 'deleteMark' });
      } finally {
        setLoadingDelete(false);
        handleCloseDeleteModal();
      }
    };

    submissionDeletion();
  };

  return (
    <>
      <tr>
        <td>
          <div className="d-flex flex-column align-items-center">
            <div className="fw-bold">{name}</div>
          </div>
        </td>
        <td>
          <div>{answer}</div>
        </td>
        <td>
          {!isGradeExist ? (
            <button
              className="btn btn-primary"
              onClick={handleOpenEvaluateModal}
            >
              Оценить
            </button>
          ) : (
            <>
              <span className="me-2">Оценка: {grade}</span>
              <button
                className="btn btn-secondary"
                onClick={handleOpenEditModal}
              >
                Подробнее
              </button>
              <DeleteButton onClick={handleOpenDeleteModal} />
            </>
          )}
        </td>
      </tr>
      {errorEvaluate && (
        <p className="text-danger">Ошибка создания оценки. Попробуйте снова</p>
      )}
      {errorDelete && <p className="text-danger">{errorDelete}</p>}
      {errorEdit && (
        <p className="text-danger">
          Ошибка редактирования оценки. Попробуйте снова
        </p>
      )}

      <ConfirmModal
        show={showDeleteModal}
        onClose={handleCloseDeleteModal}
        onConfirm={handleDelete}
        title="Подтверждение удаления"
        body="Вы уверены, что хотите удалить оценку?"
        loading={loadingDelete}
      />

      <EditModal
        show={showEvaluateModal}
        onClose={handleCloseEvaluateModal}
        title="Оценить"
        fields={[
          {
            label: 'Оценка',
            value: grade,
            onChange: setGrade,
          },
          {
            label: 'Комментарий',
            value: comment,
            onChange: setComment,
          },
        ]}
        loading={loadingEvaluate}
        onSave={handleEvaluate}
      />

      <EditModal
        show={showEditModal}
        onClose={handleCloseEditModal}
        title="Оценить"
        fields={[
          {
            label: 'Оценка',
            value: grade,
            onChange: setGrade,
          },
          {
            label: 'Комментарий',
            value: comment,
            onChange: setComment,
          },
        ]}
        loading={loadingEdit}
        onSave={handleEdit}
      />
    </>
  );
};
