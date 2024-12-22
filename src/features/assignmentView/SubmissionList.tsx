import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { logErrorToService } from '../../services/errorLogger';
import { Submission } from '../assignmentView/Submission';
import { useAppSelector } from '../../app/hooks';
import { selectAccessToken } from '../login/selectors';
import { BASE_API_URL } from '../../config';
import { Loading } from '../../components/Loading';
import './assignmentView.css';

interface Props {
  assignmentId: string | undefined;
}

interface SubmissionData {
  Answer: string;
  submissionId: string;
  submittedAt: string;
  userName: string;
  grade: string | null;
  feedback: string | null;
}

export const SubmissionList: React.FC<Props> = ({ assignmentId }) => {
  const [submissions, setSubmissions] = useState<SubmissionData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const accessToken = useAppSelector(selectAccessToken);

  useEffect(() => {
    if (!assignmentId) {
      return;
    }

    const fetchSubmissions = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get(
          `${BASE_API_URL}/assignment/${assignmentId}/submissions`,
          {
            headers: {
              Authorization: accessToken,
              'Content-Type': 'application/json',
            },
          },
        );
        const submissions = response.data.submissions;

        setSubmissions(submissions);
      } catch (error) {
        setError('Error loading data');
        logErrorToService(error, { context: 'fetchDataSubmissionsTeacher' });
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, [assignmentId, accessToken]);

  return (
    <div className="container mt-4">
      <h3 className="text-center mb-4">Все ответы</h3>

      {loading && <Loading />}
      {error && !loading && (
        <p className="text-danger text-center">Ошибка получения данных</p>
      )}

      {!loading && !error && (
        <div className="table-responsive">
          <table className="table table-bordered text-center submission-table">
            <thead className="table-light">
              <tr>
                <th>Ученик</th>
                <th>Ответ</th>
                <th>Оценить</th>
              </tr>
            </thead>
            <tbody>
              {submissions.length === 0 ? (
                <tr>
                  <td colSpan={3} className="text-center">
                    Ответов на задание пока нет
                  </td>
                </tr>
              ) : (
                submissions.map(submission => (
                  <Submission
                    key={submission.submissionId}
                    submissionId={submission.submissionId}
                    name={submission.userName}
                    answer={submission.Answer}
                    grade={submission.grade}
                    feedback={submission.feedback}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
