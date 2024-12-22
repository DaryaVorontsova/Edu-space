import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../app/hooks';
import { logout } from '../features/login/loginFormSlice';
import '../assets/navbar.css';
import { PermissionsWrapper } from '../features/permissions/PermissionsWrapper';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem('accessToken');
    sessionStorage.removeItem('accessToken');
    navigate('/login');
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      <div className="sidebar-toggle">
        <button className="btn btn-primary me-2" onClick={toggleSidebar}>
          <img
            style={{ width: '20px', margin: '10px' }}
            src="/side-bar.svg"
            alt="side bar"
          />
        </button>
      </div>

      <div
        className={`sidebar ${
          isSidebarOpen ? 'open' : ''
        } d-flex flex-column flex-shrink-0 p-3 bg-body-tertiary`}
        style={{ height: '100%' }}
      >
        <a
          href="/dashboard"
          className="d-flex align-items-center mb-3 mb-md-0 me-md-auto link-body-emphasis text-decoration-none"
        >
          <img
            style={{ width: '20px', margin: '10px' }}
            src="/side-bar.svg"
            alt="side bar"
            className="user-info"
          />
          <span className="fs-4 ms-2 text-center text-md-end w-100 ">
            EduSpace
          </span>
        </a>
        <hr />
        <ul className="nav nav-pills flex-column mb-auto">
          <li className="nav-item">
            <Link
              to="/dashboard"
              className={`nav-link ${
                location.pathname === '/dashboard'
                  ? 'active'
                  : 'link-body-emphasis'
              } text-center`}
            >
              Мои предметы
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="/profile"
              className={`nav-link ${
                location.pathname === '/profile'
                  ? 'active'
                  : 'link-body-emphasis'
              } text-center`}
            >
              Личный кабинет
            </Link>
          </li>
          <PermissionsWrapper permission="CreateUser">
            <li className="nav-item">
              <Link
                to="/createUser"
                className={`nav-link ${
                  location.pathname === '/createUser'
                    ? 'active'
                    : 'link-body-emphasis'
                } text-center`}
              >
                Добавить пользователя
              </Link>
            </li>
          </PermissionsWrapper>
          <li className="nav-item">
            <Link
              to="/metrics"
              className={`nav-link ${
                location.pathname === '/metrics'
                  ? 'active'
                  : 'link-body-emphasis'
              } text-center`}
            >
              Метрики
            </Link>
          </li>
        </ul>
        <hr />
        <ul className="nav nav-pills flex-column">
          <li className="nav-item">
            <button
              onClick={handleLogout}
              className="nav-link link-body-emphasis dropdown"
            >
              Выйти из аккаунта
            </button>
          </li>
        </ul>
      </div>
      {isSidebarOpen && (
        <div
          className="sidebar-backdrop"
          role="button"
          tabIndex={0}
          onClick={toggleSidebar}
          onKeyDown={e => {
            if (e.key === 'Enter' || e.key === ' ') {
              toggleSidebar();
            }
          }}
          aria-label="Закрыть боковую панель"
        />
      )}
    </>
  );
};
