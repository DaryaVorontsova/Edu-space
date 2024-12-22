import React, { useEffect, useState, useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useAppSelector } from '../../app/hooks';
import { selectAccessToken } from '../login/selectors';
import { BASE_API_URL } from '../../config';
import axios from 'axios';
import { logErrorToService } from '../../services/errorLogger';
import { Loading } from '../../components/Loading';
import { ConfirmModal } from '../../components/ConfirmModal';
import { DeleteButton } from '../../components/DeleteButton';

interface Props {
  subjectId: string;
  addedStudent: boolean;
}

interface Student {
  studentId: string;
  firstName: string;
  lastName: string;
  middleName: string;
}

export const StudentList: React.FC<Props> = ({ subjectId, addedStudent }) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loadingFetch, setLoadingFetch] = useState<boolean>(false);
  const [errorFetch, setErrorFetch] = useState<string | null>(null);
  const [loadingDelete, setLoadingDelete] = useState<boolean>(false);
  const [errorDelete, setErrorDelete] = useState<string | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(
    null,
  );

  const accessToken = useAppSelector(selectAccessToken);

  const parentRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: students.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 50,
    overscan: 5,
  });

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoadingFetch(true);

        const response = await axios.get(
          `${BASE_API_URL}/subject/${subjectId}/students`,
          {
            headers: {
              Authorization: `${accessToken}`,
              'Content-Type': 'application/json',
            },
          },
        );

        setStudents(response.data.students);
        setErrorFetch(null);
      } catch (error) {
        setErrorFetch('Failed to load students');
        logErrorToService(error, { context: 'fetchDataStudents' });
      } finally {
        setLoadingFetch(false);
      }
    };

    fetchStudents();
  }, [subjectId, accessToken, addedStudent]);

  const openDeleteModal = (studentId: string) => {
    setSelectedStudentId(studentId);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedStudentId(null);
  };

  const handleConfirmDelete = async () => {
    if (!selectedStudentId) {
      return;
    }

    try {
      setLoadingDelete(true);
      setErrorDelete(null);

      await axios.delete(
        `${BASE_API_URL}/subject/${subjectId}/students/${selectedStudentId}`,
        {
          headers: {
            Authorization: accessToken,
            'Content-Type': 'application/json',
          },
        },
      );
      setStudents(prevStudents =>
        prevStudents.filter(student => student.studentId !== selectedStudentId),
      );
    } catch (error) {
      setErrorDelete('Failed to delete student');
      logErrorToService(error, { context: 'deleteStudent' });
    } finally {
      setLoadingDelete(false);
      handleCloseModal();
    }
  };

  return (
    <>
      {loadingFetch && <Loading />}
      {errorFetch && (
        <p className="text-danger text-center">Ошибка: {errorFetch}</p>
      )}
      <div className="student-list">
        <h4 className="text-center mb-4">Список учеников</h4>
        {students.length === 0 && !loadingFetch && !errorFetch && (
          <p className="text-center fs-4 text-muted">Учеников пока нет...</p>
        )}
        {students.length > 0 && (
          <div
            ref={parentRef}
            style={{
              maxHeight: '400px',
              overflow: 'auto',
            }}
            className="student-list-height"
          >
            <div
              style={{
                height: `${rowVirtualizer.getTotalSize()}px`,
                position: 'relative',
              }}
              className="list-group"
            >
              {rowVirtualizer.getVirtualItems().map(virtualRow => {
                const student = students[virtualRow.index];

                return (
                  <div
                    key={student.studentId}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      transform: `translateY(${virtualRow.start}px)`,
                    }}
                    className="list-group-item d-flex align-items-center justify-content-between"
                  >
                    <div className="d-flex align-items-center">
                      <span className="me-3">{virtualRow.index + 1}</span>
                      <span>{`${student.lastName} ${student.firstName}${
                        student.middleName ? ` ${student.middleName}` : ''
                      }`}</span>
                    </div>
                    <DeleteButton
                      onClick={() => openDeleteModal(student.studentId)}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <ConfirmModal
        show={showModal}
        onClose={handleCloseModal}
        title="Подтверждение удаления"
        body="Вы уверены, что хотите удалить этого ученика?"
        onConfirm={handleConfirmDelete}
        loading={loadingDelete}
      />

      {errorDelete && (
        <p className="text-danger mt-3">
          Ошибка удаления ученика. Попробуйте снова
        </p>
      )}
    </>
  );
};
