import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { useNavigate } from 'react-router-dom';
import { selectAuthLoading, selectAuthError } from './selectors';
import { loginUser } from './thunks';
import { selectIsAuthenticated } from './selectors';
import './loginForm.css';
import { Loading } from '../../components/Loading';
import { EyePasswordButton } from '../../components/EyePasswordButton';

export const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const dispatch = useAppDispatch();
  const loading = useAppSelector(selectAuthLoading);
  const error = useAppSelector(selectAuthError);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { type, value, checked } = e.target;

    switch (type) {
      case 'email':
        setEmail(value);
        break;
      case 'password':
        setPassword(value);
        break;
      case 'checkbox':
        setRememberMe(checked);
        break;
      default:
        break;
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (password.length < 6) {
      setPasswordError('Пароль должен содержать не менее 6 символов');

      return;
    }

    setPasswordError(null);
    dispatch(loginUser({ email, password, rememberMe }));
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-container d-flex justify-content-center align-items-center py-4 bg-body-tertiary">
      <div className="form-signin w-100 m-auto">
        <form className="form" onSubmit={handleSubmit}>
          <h1 className="h3 mb-3 fw-normal">Войти</h1>
          <div className="form-floating">
            <input
              type="email"
              className="form-control"
              id="floatingInput"
              placeholder="name@example.com"
              onChange={handleChange}
              required
            />
            <label htmlFor="floatingInput">Введите email адрес</label>
          </div>
          <div className="form-floating position-relative">
            <input
              type={showPassword ? 'text' : 'password'}
              className="form-control"
              id="floatingPassword"
              placeholder="Password"
              onChange={handleChange}
              required
            />
            <label htmlFor="floatingPassword">Введите пароль</label>
            <EyePasswordButton
              toggleShowPassword={toggleShowPassword}
              showPassword={showPassword}
            />
            {passwordError && (
              <div className="invalid-feedback">{passwordError}</div>
            )}
          </div>

          <div className="form-check text-start my-3">
            <input
              className="form-check-input"
              type="checkbox"
              value="remember-me"
              id="flexCheckDefault"
              onChange={handleChange}
            />
            <label className="form-check-label" htmlFor="flexCheckDefault">
              Запомнить меня
            </label>
          </div>
          {error && (
            <p className="text-danger text-center">
              Почта или пароль введены неверно. Попробуйте снова
            </p>
          )}
          {loading && <Loading />}
          <button className="btn btn-primary w-100 py-2" type="submit">
            Войти
          </button>
        </form>
      </div>
    </div>
  );
};
