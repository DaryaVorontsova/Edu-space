import React, { useState } from 'react';
import axios from 'axios';
import { logErrorToService } from '../../services/errorLogger';
import { useAppSelector } from '../../app/hooks';
import { selectAccessToken } from '../login/selectors';
import { BASE_API_URL } from '../../config';

interface Props {
  subjectId: string;
  onStudentAdded: (expired: boolean) => void;
}

export const StudentAddingForm: React.FC<Props> = ({
  subjectId,
  onStudentAdded,
}) => {
  const [studentEmail, setStudentEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const accessToken = useAppSelector(selectAccessToken);

  const handleAddStudent = async (event: React.FormEvent) => {
    event.preventDefault();

    const addedStudent = { email: studentEmail };

    try {
      setLoading(true);

      await axios.post(
        `${BASE_API_URL}/subject/${subjectId}/students/add`,
        addedStudent,
        {
          headers: {
            Authorization: accessToken,
          },
        },
      );

      setStudentEmail('');
      onStudentAdded(true);
    } catch (error) {
      setError('Adding student error');
      logErrorToService(error, { context: 'addingStudentToSubject' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-5">
      <h4 className="text-center mb-4">Добавить ученика</h4>
      <form
        className="form-inline d-flex flex-column align-items-center"
        onSubmit={handleAddStudent}
      >
        <div className="mb-3 w-100">
          <label htmlFor="studentEmail" className="form-label">
            Почта ученика
          </label>
          <input
            type="email"
            className="form-control"
            id="studentEmail"
            value={studentEmail}
            onChange={e => setStudentEmail(e.target.value)}
            placeholder="Введите email ученика"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Загрузка...' : 'Добавить'}
        </button>
      </form>

      {error && (
        <p className="text-danger mt-3">
          Ошибка добавления ученика. Попробуйте снова
        </p>
      )}
    </div>
  );
};
