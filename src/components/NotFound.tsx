import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

export const NotFound: React.FC = () => {
  return (
    <div
      className="container d-flex justify-content-center align-items-center"
      style={{ height: '100vh' }}
    >
      <div className="text-center">
        <h1 className="display-1 text-danger">404</h1>
        <h2 className="mb-4">Страница не найдена</h2>
        <p className="lead">
          Извините, страница, которую вы ищете, не существует. Проверьте
          правильность URL или вернитесь на главную страницу.
        </p>
        <Link to="/dashboard" className="btn btn-primary btn-lg">
          Вернуться на главную
        </Link>
      </div>
    </div>
  );
};
