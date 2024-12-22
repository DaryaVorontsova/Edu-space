import React from 'react';

export const Loading: React.FC = () => {
  return (
    <div className="spinner-border text-primary text-center" role="status">
      <span className="visually-hidden">Загрузка...</span>
    </div>
  );
};
