import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { logErrorToService } from '../../services/errorLogger';
import { Card } from 'react-bootstrap';
import { useAppSelector } from '../../app/hooks';
import { selectAccessToken } from '../login/selectors';
import { BASE_API_URL } from '../../config';
import { Loading } from '../../components/Loading';

interface SubmissionProps {
  grade: string | null;
  isDeadlineExpired: boolean;
  assignmentId: string | undefined;
  subjectId: string | undefined;
  setTeacherGrade: (expired: string | null) => void;
  setTeacherFeedback: (expired: string | null) => void;
}

export const SubmissionAnswerForm: React.FC<SubmissionProps> = ({
  grade,
  isDeadlineExpired,
  assignmentId,
  subjectId,
  setTeacherGrade,
  setTeacherFeedback,
}) => {
  const accessToken = useAppSelector(selectAccessToken);
  const [answer, setAnswer] = useState('');
  const [submittedAnswer, setSubmittedAnswer] = useState<string | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [submissionTime, setSubmissionTime] = useState<string | null>(null);
  const [errorSubmit, setErrorSubmit] = useState<string | null>(null);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!assignmentId) {
      return;
    }

    const fetchSubmission = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get(
          `${BASE_API_URL}/assignment/${assignmentId}/my-submission`,
          {
            headers: {
              Authorization: accessToken,
            },
          },
        );

        const { submission } = response.data;

        if (submission) {
          setSubmittedAnswer(submission.Answer);
          setSubmissionTime(new Date(submission.submittedAt).toLocaleString());
          setTeacherGrade(submission.grade);
          setTeacherFeedback(submission.feedback);
          setIsSent(true);
        } else {
          setSubmittedAnswer(null);
          setSubmissionTime(null);
          setIsSent(false);
          setTeacherGrade(null);
          setTeacherFeedback(null);
        }
      } catch (error) {
        setError('Loading answer error');
        logErrorToService(error, { context: 'fetchDataSubmissionsStudent' });
      } finally {
        setLoading(false);
      }
    };

    fetchSubmission();
  }, [assignmentId, accessToken]);

  const handleChangeShowAnswer = () => {
    setShowAnswer(!showAnswer);
  };

  const handleSubmitAnswer = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setErrorSubmit(null);
      setLoadingSubmit(true);

      await axios.post(
        `${BASE_API_URL}/subject/${subjectId}/assignment/${assignmentId}/submit`,
        { Answer: answer },
        {
          headers: {
            Authorization: accessToken,
            'Content-Type': 'application/json',
          },
        },
      );
      setSubmittedAnswer(answer);
      setAnswer('');
      setIsSent(true);
      setSubmissionTime(new Date().toLocaleString());
    } catch (error) {
      setErrorSubmit('Error sending answer for the task');
      logErrorToService(error, { context: 'createNewAnswer' });
    } finally {
      setLoadingSubmit(false);
    }
  };

  return (
    <div className="d-flex flex-column justify-content-center align-items-center gap-4">
      <h4 className="text-center mt-4">Отправка ответа</h4>
      <form
        className="form-inline d-flex flex-column align-items-center w-100"
        onSubmit={handleSubmitAnswer}
      >
        <div className="mb-3 w-100">
          <label htmlFor="answerDescription" className="form-label">
            Напишите ответ на задание
          </label>
          <textarea
            className="form-control"
            id="answerDescription"
            value={answer}
            onChange={e => setAnswer(e.target.value)}
            rows={3}
            placeholder="Введите ответ"
            required
            disabled={isDeadlineExpired || isSent}
          />
        </div>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isDeadlineExpired || isSent || loadingSubmit}
        >
          {loadingSubmit ? 'Отправка...' : 'Отправить'}
        </button>
      </form>

      {loading && <Loading />}
      {errorSubmit && (
        <p className="text-danger">Ошибка отправки задания. Попробуйте снова</p>
      )}
      {error && (
        <p className="text-danger">Ошибка загрузки ответа. Попробуйте снова</p>
      )}

      <div className="w-100 text-start">
        <button
          className="btn btn-outline-primary mb-3"
          onClick={handleChangeShowAnswer}
        >
          {showAnswer ? 'Скрыть ответ' : 'Показать ответ'}
        </button>

        {showAnswer && (
          <Card className="d-flex justify-content-center align-items-center">
            <Card.Body className=" w-100 text-center">
              <p className="m-0">
                {submittedAnswer || 'Ответ ещё не отправлен.'}
              </p>
            </Card.Body>
          </Card>
        )}
      </div>

      <div className="container text-center mb-5">
        <div className="row">
          <div className="col-4 p-3 bg-secondary text-white border rounded-start">
            <span className="fs-6 d-none d-md-inline">Состояние ответа</span>
            <span className="fs-7 d-inline d-md-none">Сост. ответа</span>
          </div>
          <div className="col-8 p-3 bg-white text-dark border rounded-end">
            {isSent
              ? `Отправлено. Время отправки: ${submissionTime}`
              : 'Не отправлено'}
          </div>
          <div className="col-4 p-3 bg-secondary text-white border rounded-start">
            <span className="fs-6 d-none d-md-inline">
              Состояние оценивания
            </span>
            <span className="fs-7 d-inline d-md-none">Сост. оценки</span>
          </div>
          <div className="col-8 p-3 bg-white text-dark border rounded-end">
            {grade === null ? 'Не оценено' : 'Оценено'}
          </div>
        </div>
      </div>
    </div>
  );
};
