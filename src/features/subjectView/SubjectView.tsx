import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import {
  selectAssignments,
  selectAssignmentsError,
  selectAssignmentsLoading,
  selectSubjectName,
  selectSubjectDescription,
  selectTeacherName,
} from './selectors';
import { fetchAssignments } from './thunks';
import './subjectView.css';
import { PermissionsWrapper } from '../permissions/PermissionsWrapper';
import { selectPermissions } from '../permissions/selectors';
import { SubjectInfo } from './SubjectInfo';
import { Assignment } from './Assignment';
import { StudentList } from './StudentList';
import { StudentAddingForm } from './StudentAddingForm';
import { AssignmentAddingForm } from './AssignmentAddingForm';
import { Loading } from '../../components/Loading';
import { BackButton } from '../../components/BackButton';

export const SubjectView: React.FC = () => {
  const { id_subject } = useParams<Record<string, string>>();
  const dispatch = useAppDispatch();

  const assignments = useAppSelector(selectAssignments);
  const loading = useAppSelector(selectAssignmentsLoading);
  const error = useAppSelector(selectAssignmentsError);
  const subjectName = useAppSelector(selectSubjectName);
  const subjectDescription = useAppSelector(selectSubjectDescription);
  const teacherName = useAppSelector(selectTeacherName);

  const [studentsUpdated, setStudentsUpdated] = useState(false);

  useEffect(() => {
    if (id_subject) {
      dispatch(fetchAssignments(id_subject));
    }
  }, [dispatch, id_subject]);

  useEffect(() => {
    if (studentsUpdated) {
      setStudentsUpdated(false);
    }
  }, [studentsUpdated]);

  const permissions = useAppSelector(selectPermissions).permissions;
  const hasStudentList = permissions.StudentList;
  const hasStudentAddingForm = permissions.StudentAddingForm;

  const isLeftColumnVisible = hasStudentList || hasStudentAddingForm;

  return (
    <div className="container my-3">
      <BackButton />

      <SubjectInfo
        subjectId={id_subject}
        name={subjectName}
        teacherName={teacherName}
        description={subjectDescription}
      />

      {loading && <Loading />}
      {error && (
        <p className="text-danger text-center">
          Ошибка получения заданий. Попробуйте снова и обновите страницу
        </p>
      )}

      {!loading && !error && (
        <div className="row g-4">
          {isLeftColumnVisible && (
            <div className="col-lg-5">
              <PermissionsWrapper permission="StudentList">
                <div className="mb-4">
                  <div className="card-body">
                    {id_subject && (
                      <StudentList
                        subjectId={id_subject}
                        addedStudent={studentsUpdated}
                      />
                    )}
                  </div>
                </div>
              </PermissionsWrapper>

              <PermissionsWrapper permission="StudentAddingForm">
                <div className="card-body">
                  {id_subject && (
                    <StudentAddingForm
                      subjectId={id_subject}
                      onStudentAdded={() => setStudentsUpdated(true)}
                    />
                  )}
                </div>
              </PermissionsWrapper>
            </div>
          )}

          <div className={isLeftColumnVisible ? 'col-lg-7' : 'col-12'}>
            <div className="mb-4">
              <h4 className="text-center mb-4">Список заданий</h4>
              <div className="card-body">
                {assignments.length > 0 ? (
                  <ul className="list-unstyled">
                    {assignments.map(assignment => (
                      <li
                        key={assignment.assignmentId}
                        className="card mb-3 p-3"
                      >
                        <Assignment
                          subjectId={id_subject}
                          id={assignment.assignmentId}
                          title={assignment.title}
                          description={assignment.description}
                          deadline={assignment.deadline}
                        />
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-center my-5">
                    <p className="text-muted fs-4">Заданий пока нет...</p>
                  </div>
                )}
              </div>
            </div>

            <PermissionsWrapper permission="AssignmentAddingForm">
              <div className="card-body">
                {id_subject && <AssignmentAddingForm subjectId={id_subject} />}
              </div>
            </PermissionsWrapper>
          </div>
        </div>
      )}
    </div>
  );
};
