import React, { useState } from 'react';
import axios from 'axios';
import { BASE_API_URL } from '../../config';
import { useAppSelector } from '../../app/hooks';
import { selectAccessToken } from '../login/selectors';
import { logErrorToService } from '../../services/errorLogger';

export const CreateUser: React.FC = () => {
  const accessToken = useAppSelector(selectAccessToken);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    middleName: '',
    email: '',
    role: '',
  });

  const [noMiddleName, setNoMiddleName] = useState(false);
  const [formErrors, setFormErrors] = useState({
    firstName: false,
    lastName: false,
    email: false,
    role: false,
    middleName: false,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    setFormData({ ...formData, [name]: value });
    setFormErrors({ ...formErrors, [name]: false });
  };

  const handleNoMiddleNameChange = () => {
    setNoMiddleName(!noMiddleName);
    setFormData({ ...formData, middleName: '' });
    setFormErrors({ ...formErrors, middleName: false });
  };

  const validateForm = () => {
    const errors = {
      firstName: formData.firstName.trim() === '',
      lastName: formData.lastName.trim() === '',
      email: formData.email.trim() === '',
      role: formData.role.trim() === '',
      middleName: formData.middleName.trim() === '' && !noMiddleName,
    };

    setFormErrors(errors);

    return !Object.values(errors).includes(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const dataToSend = {
      ...formData,
      middleName: noMiddleName ? null : formData.middleName || null,
    };

    try {
      setLoading(true);
      setError(null);

      await axios.post(`${BASE_API_URL}/register`, dataToSend, {
        headers: {
          Authorization: accessToken,
        },
      });

      setFormData({
        firstName: '',
        lastName: '',
        middleName: '',
        email: '',
        role: '',
      });
      setNoMiddleName(false);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 400) {
          setError('Пользователь с такой почтой уже зарегистрирован');
        } else {
          setError('Ошибка при регистрации пользователя. Попробуйте снова');
        }
      } else {
        setError('Произошла неизвестная ошибка');
      }

      logErrorToService(error, { context: 'RegisterNewUser' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container d-flex flex-column justify-content-center align-items-center py-3 w-100">
      <h4 className="mb-3 text-center">Добавить пользователя</h4>
      <form
        className="needs-validation custom-form-width mx-auto"
        noValidate
        onSubmit={handleSubmit}
      >
        <div className="mb-3">
          <label htmlFor="firstName" className="form-label">
            Имя
          </label>
          <input
            type="text"
            className={`form-control ${formErrors.firstName ? 'is-invalid' : ''}`}
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="Введите имя пользователя"
          />
          {formErrors.firstName && (
            <div className="invalid-feedback">Введите имя</div>
          )}
        </div>

        <div className="mb-3">
          <label htmlFor="lastName" className="form-label">
            Фамилия
          </label>
          <input
            type="text"
            className={`form-control ${formErrors.lastName ? 'is-invalid' : ''}`}
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Введите фамилию пользователя"
          />
          {formErrors.lastName && (
            <div className="invalid-feedback">Введите фамилию</div>
          )}
        </div>

        <div className="mb-3">
          <label htmlFor="middleName" className="form-label">
            Отчество
          </label>
          <input
            type="text"
            className={`form-control ${formErrors.middleName ? 'is-invalid' : ''}`}
            id="middleName"
            name="middleName"
            value={formData.middleName}
            onChange={handleChange}
            placeholder="Введите отчество пользователя"
            disabled={noMiddleName}
          />
          {formErrors.middleName && !noMiddleName && (
            <div className="invalid-feedback">
              Введите отчество или выберите &quot;Нет отчества&quot;
            </div>
          )}
          <div className="form-check mt-2">
            <input
              type="checkbox"
              className="form-check-input"
              id="noMiddleName"
              checked={noMiddleName}
              onChange={handleNoMiddleNameChange}
            />
            <label className="form-check-label" htmlFor="noMiddleName">
              Нет отчества
            </label>
          </div>
        </div>

        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            type="email"
            className={`form-control ${formErrors.email ? 'is-invalid' : ''}`}
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Введите email пользователя"
          />
          {formErrors.email && (
            <div className="invalid-feedback">Введите корректный email</div>
          )}
        </div>

        <div className="mb-3">
          <label htmlFor="role" className="form-label">
            Выберите роль
          </label>
          <select
            className={`form-select ${formErrors.role ? 'is-invalid' : ''}`}
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
          >
            <option value="" disabled>
              Выберите...
            </option>
            <option value="teacher">Учитель</option>
            <option value="student">Ученик</option>
            <option value="admin">Админ</option>
          </select>
          {formErrors.role && (
            <div className="invalid-feedback">Выберите роль</div>
          )}
        </div>

        <div className="text-center">
          <button
            type="submit"
            className="btn btn-primary btn-lg btn-sm-lg"
            disabled={loading}
          >
            {loading ? 'Загрузка...' : 'Зарегистрировать'}
          </button>
        </div>
        {error && <p className="text-danger mt-3 text-center">{error}</p>}
      </form>
    </div>
  );
};
