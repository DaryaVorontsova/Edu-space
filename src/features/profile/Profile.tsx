import React, { useState } from 'react';
import axios from 'axios';
import { logErrorToService } from '../../services/errorLogger';
import { useAppSelector } from '../../app/hooks';
import {
  selectUserProfile,
  selectProfileLoading,
  selectProfileError,
} from './selectors';
import { selectAccessToken } from '../login/selectors';
import { Loading } from '../../components/Loading';
import { BASE_API_URL } from '../../config';
import { EyePasswordButton } from '../../components/EyePasswordButton';
import { BackButton } from '../../components/BackButton';

export const Profile: React.FC = () => {
  const userProfile = useAppSelector(selectUserProfile);
  const loading = useAppSelector(selectProfileLoading);
  const error = useAppSelector(selectProfileError);

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [errorSubmit, setErrorSubmit] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const accessToken = useAppSelector(selectAccessToken);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;

    switch (id) {
      case 'old-password':
        setOldPassword(value);
        break;
      case 'new-password':
        setNewPassword(value);
        break;
      default:
        break;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword.length < 6) {
      setPasswordError('Новый пароль должен содержать не менее 6 символов');

      return;
    }

    setPasswordError(null);

    const payload = {
      oldPassword: oldPassword,
      newPassword: newPassword,
    };

    try {
      setErrorSubmit(null);
      setLoadingSubmit(true);

      const response = await axios.post(
        `${BASE_API_URL}/change_password`,
        payload,
        {
          headers: {
            Authorization: accessToken,
          },
        },
      );

      if (response.status === 200) {
        setOldPassword('');
        setNewPassword('');
      }
    } catch (error) {
      setErrorSubmit('Change password error');
      logErrorToService(error, { context: 'ChangePasswordSubmit' });
    } finally {
      setLoadingSubmit(false);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const toggleShowNewPassword = () => {
    setShowNewPassword(!showNewPassword);
  };

  return (
    <div className="container d-flex flex-column align-items-center py-3 w-100">
      <div className="w-100 text-start mb-3">
        <BackButton />
      </div>
      {error && <p className="text-danger">{error}</p>}
      {loading && <Loading />}
      <div className="d-flex flex-column flex-md-row align-items-center align-items-md-start mb-4">
        <div className="mb-3 mb-md-0 text-center text-md-start">
          <img
            src="/user.svg"
            alt="no avatar profile"
            className="img-fluid rounded-circle user-picture"
            style={{ width: '100px' }}
          />
        </div>
        <div className="text-center text-md-start ms-md-3">
          <h2 className="mb-1">
            {`${userProfile.lastName} ${userProfile.firstName}${
              userProfile.middleName ? ` ${userProfile.middleName}` : ''
            }`}
          </h2>
          <p className="fs-5 text-muted">{userProfile.email}</p>
          <p className="fs-5 text-muted">{userProfile.role}</p>
        </div>
      </div>

      <div className="row w-100 w-md-50 py-3">
        <div className="col-12">
          <h4 className="mb-3 text-center">Форма для смены пароля</h4>
          <form
            className="needs-validation custom-form-width mx-auto"
            noValidate
            onSubmit={handleSubmit}
          >
            <div className="mb-3 position-relative">
              <label htmlFor="old-password" className="form-label">
                Старый пароль
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-control"
                id="old-password"
                value={oldPassword}
                onChange={handleChange}
                required
              />
              <div className="invalid-feedback">Введите старый пароль</div>
              <EyePasswordButton
                toggleShowPassword={toggleShowPassword}
                showPassword={showPassword}
              />
            </div>
            <div className="mb-3 position-relative">
              <label htmlFor="new-password" className="form-label">
                Новый пароль
              </label>
              <input
                type={showNewPassword ? 'text' : 'password'}
                className={`form-control ${passwordError ? 'is-invalid' : ''}`}
                id="new-password"
                value={newPassword}
                onChange={handleChange}
                required
              />
              <div className="invalid-feedback">{passwordError}</div>
              <EyePasswordButton
                toggleShowPassword={toggleShowNewPassword}
                showPassword={showNewPassword}
              />
            </div>
            <div className="text-center">
              <button
                className="btn btn-primary btn-lg"
                type="submit"
                disabled={loadingSubmit}
              >
                {loadingSubmit ? 'Загрузка...' : 'Отправить'}
              </button>
            </div>
          </form>
        </div>
      </div>
      {errorSubmit && (
        <p className="text-danger tex-center">
          Произошла ошибка отправки формы. Возможно старый пароль введен не
          верно
        </p>
      )}
    </div>
  );
};
