import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BASE_API_URL } from '../../config';
import { logErrorToService } from '../../services/errorLogger';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { Subject } from './Subject';
import { fetchSubjects } from './thunks';
import {
  selectSubjects,
  selectSubjectsLoading,
  selectSubjectsError,
} from './selectors';
import { Loading } from '../../components/Loading';
import { AddSubject } from './AddSubject';
import { EditModal } from '../../components/EditModal';
import { selectAccessToken } from '../login/selectors';
import { addSubject } from './dashboardSlice';
import './dashboard.css';
import { PermissionsWrapper } from '../permissions/PermissionsWrapper';

export const Dashboard = () => {
  const dispatch = useAppDispatch();
  const subjects = useAppSelector(selectSubjects);
  const loading = useAppSelector(selectSubjectsLoading);
  const error = useAppSelector(selectSubjectsError);
  const accessToken = useAppSelector(selectAccessToken);

  const [showAddModal, setShowAddModal] = useState(false);
  const [loadingAdd, setLoadingAdd] = useState(false);
  const [errorAdd, setErrorAdd] = useState<string | null>(null);
  const [addedName, setAddedName] = useState('');
  const [addedDescription, setAddedDescription] = useState('');
  const [addedEmail, setAddedEmail] = useState('');

  const changeEditModal = (value: boolean) => {
    setShowAddModal(value);
  };

  const handleAddSubject = async () => {
    try {
      setLoadingAdd(true);
      setErrorAdd(null);

      const newSubject = {
        name: addedName,
        description: addedDescription,
        teacherEmail: addedEmail,
      };

      const response = await axios.post(
        `${BASE_API_URL}/subject/add`,
        newSubject,
        {
          headers: {
            Authorization: accessToken,
          },
        },
      );

      if (response.status === 201) {
        const createdSubject = {
          id: response.data.subjectId,
          name: response.data.name,
          description: response.data.description,
          teacherName: response.data.teacherName,
        };

        dispatch(addSubject(createdSubject));
        setAddedName('');
        setAddedDescription('');
        setAddedEmail('');
      }
    } catch (error) {
      setErrorAdd('Adding assignment error');
      logErrorToService(error, { context: 'creatingSubject' });
    } finally {
      setLoadingAdd(false);
      setShowAddModal(false);
    }
  };

  useEffect(() => {
    dispatch(fetchSubjects());
  }, [dispatch]);

  return (
    <>
      <h4 className="text-center">Мои предметы</h4>
      {loading && (
        <div className="d-flex justify-content-center align-items-center">
          {' '}
          <Loading />{' '}
        </div>
      )}
      {error && <p className="text-danger text-center">Ошибка: {error}</p>}

      {!loading && !error && subjects.length === 0 && (
        <p className="fs-4 text-center text-muted">Предметов пока нет...</p>
      )}

      {!loading && !error && subjects.length > 0 && (
        <div className="album py-3 bg-body-tertiary">
          <div className="container">
            <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 g-4">
              <PermissionsWrapper permission="AddSubject">
                <AddSubject onClick={() => changeEditModal(true)} />
              </PermissionsWrapper>

              {subjects.map(subject => (
                <div
                  className="col d-flex justify-content-center"
                  key={subject.id}
                >
                  <Subject
                    key={subject.id}
                    id={subject.id}
                    name={subject.name}
                    teacherName={subject.teacherName}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <EditModal
        show={showAddModal}
        title="Создание нового предмета"
        onClose={() => changeEditModal(false)}
        fields={[
          {
            label: 'Название предмета',
            value: addedName,
            onChange: setAddedName,
          },
          {
            label: 'Описание предмета',
            value: addedDescription,
            onChange: setAddedDescription,
          },
          {
            label: 'Email преподавателя',
            value: addedEmail,
            onChange: setAddedEmail,
          },
        ]}
        onSave={handleAddSubject}
        loading={loadingAdd}
      />

      {errorAdd && (
        <p className="text-danger text-center">
          Ошибка добавления предмета. Попробуйте снова
        </p>
      )}
    </>
  );
};
