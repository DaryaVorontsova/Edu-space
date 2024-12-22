import React, { useState } from 'react';
import axios from 'axios';
import { logErrorToService } from '../../services/errorLogger';
import { BASE_API_URL } from '../../config';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { selectAccessToken } from '../login/selectors';
import { addAssignment } from './subjectViewSlice';

interface Props {
  subjectId: string;
}

export const AssignmentAddingForm: React.FC<Props> = ({ subjectId }) => {
  const dispatch = useAppDispatch();

  const [assignmentTitle, setAssignmentTitle] = useState('');
  const [assignmentDescription, setAssignmentDescription] = useState('');
  const [assignmentDeadline, setAssignmentDeadline] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const accessToken = useAppSelector(selectAccessToken);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { id, value } = e.target;

    switch (id) {
      case 'assignmentTitle':
        setAssignmentTitle(value);
        break;
      case 'assignmentDeadline':
        setAssignmentDeadline(value);
        break;
      case 'assignmentDescription':
        setAssignmentDescription(value);
        break;
      default:
        break;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const deadlineTimestamp = Math.floor(
      new Date(assignmentDeadline).getTime() / 1000,
    );

    const newAssignment = {
      title: assignmentTitle,
      description: assignmentDescription,
      deadline: deadlineTimestamp,
    };

    try {
      setLoading(true);
      setError(null);

      const response = await axios.post(
        `${BASE_API_URL}/subject/${subjectId}/assignments/create`,
        newAssignment,
        {
          headers: {
            Authorization: accessToken,
          },
        },
      );

      if (response.status === 201) {
        const createdAssignment = {
          assignmentId: response.data.assignmentId,
          title: assignmentTitle,
          description: assignmentDescription,
          deadline: assignmentDeadline,
        };

        dispatch(addAssignment(createdAssignment));
        setAssignmentTitle('');
        setAssignmentDescription('');
        setAssignmentDeadline('');
      }
    } catch (error) {
      setError('Adding assignment error');
      logErrorToService(error, { context: 'creatingAssignment' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-assignment-form mt-5">
      <h4 className="text-center mb-4">Создать задание</h4>
      <form
        className="form d-flex flex-column align-items-center"
        onSubmit={handleSubmit}
      >
        <div className="mb-3 w-100">
          <label htmlFor="assignmentTitle" className="form-label">
            Название задания
          </label>
          <input
            type="text"
            className="form-control"
            id="assignmentTitle"
            value={assignmentTitle}
            onChange={handleChange}
            placeholder="Введите название задания"
            required
          />
        </div>
        <div className="mb-3 w-100">
          <label htmlFor="assignmentDescription" className="form-label">
            Описание задания
          </label>
          <textarea
            className="form-control"
            id="assignmentDescription"
            value={assignmentDescription}
            onChange={handleChange}
            rows={3}
            placeholder="Введите описание задания"
            required
          />
        </div>
        <div className="mb-3 w-100">
          <label htmlFor="assignmentDeadline" className="form-label">
            Дедлайн
          </label>
          <input
            type="datetime-local"
            className="form-control"
            id="assignmentDeadline"
            value={assignmentDeadline}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Загрузка...' : 'Создать'}
        </button>

        {error && (
          <p className="text-danger text-center">
            Ошибка добавления задания. Попробуйте снова
          </p>
        )}
      </form>
    </div>
  );
};
