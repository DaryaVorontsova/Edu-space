import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { logErrorToService } from '../../services/errorLogger';
import { useParams } from 'react-router-dom';
import { AssignmentInfo } from '../assignmentView/AssignmentInfo';
import { SubmissionAnswerForm } from '../assignmentView/SubmissionAnswerForm';
import { TeacherEvaluation } from '../assignmentView/TeacherEvaluation';
import { SubmissionList } from '../assignmentView/SubmissionList';
import { PermissionsWrapper } from '../permissions/PermissionsWrapper';
import { useAppSelector } from '../../app/hooks';
import { selectAccessToken } from '../login/selectors';
import { BASE_API_URL } from '../../config';
import { Loading } from '../../components/Loading';
import { BackButton } from '../../components/BackButton';

interface Assignment {
  title: string;
  description: string;
  deadline: string;
}

export const AssignmentView: React.FC = () => {
  const { subjectId, assignmentId } = useParams<Record<string, string>>();
  const accessToken = useAppSelector(selectAccessToken);

  const [assignmentData, setAssignmentData] = useState<Assignment | null>(null);
  const [isDeadlineExpired, setIsDeadlineExpired] = useState(false);
  const [teacherGrade, setTeacherGrade] = useState<string | null>(null);
  const [teacherFeedback, setTeacherFeedback] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!assignmentId) {
      return;
    }

    const fetchAssignmentData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get(
          `${BASE_API_URL}/assignments/${assignmentId}`,
          {
            headers: {
              Authorization: accessToken,
            },
          },
        );

        const { title, description, deadline } = response.data;

        setAssignmentData({ title, description, deadline });
      } catch (error) {
        setError('Loading assignment error');
        logErrorToService(error, { context: 'fetchDataAssignmentDescription' });
      } finally {
        setLoading(false);
      }
    };

    fetchAssignmentData();
  }, [assignmentId, accessToken]);

  return (
    <div className="container my-3">
      <BackButton />
      {loading && <Loading />}
      {error && !assignmentData && <p className="text-danger">{error}</p>}
      {assignmentData && (
        <AssignmentInfo
          name={assignmentData.title}
          description={assignmentData.description}
          deadline={assignmentData.deadline}
          setIsDeadlineExpired={setIsDeadlineExpired}
        />
      )}
      <div className="row g-4">
        <div className="col-lg-7">
          <PermissionsWrapper permission="SubmissionAnswerForm">
            <SubmissionAnswerForm
              assignmentId={assignmentId}
              subjectId={subjectId}
              grade={teacherGrade}
              isDeadlineExpired={isDeadlineExpired}
              setTeacherGrade={setTeacherGrade}
              setTeacherFeedback={setTeacherFeedback}
            />
          </PermissionsWrapper>
        </div>
        <div className="col-lg-5">
          <PermissionsWrapper permission="TeacherEvaluation">
            <TeacherEvaluation
              grade={teacherGrade}
              feedback={teacherFeedback}
            />
          </PermissionsWrapper>
        </div>
      </div>

      <PermissionsWrapper permission="SubmissionList">
        <SubmissionList assignmentId={assignmentId} />
      </PermissionsWrapper>
    </div>
  );
};
