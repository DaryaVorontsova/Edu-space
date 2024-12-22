import React from 'react';
import { useNavigate } from 'react-router-dom';

export const BackButton: React.FC = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <button className="btn btn-outline-primary" onClick={handleGoBack}>
      <i className="bi bi-arrow-left"></i> Назад
    </button>
  );
};
