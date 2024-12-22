import React from 'react';
import { Button } from 'react-bootstrap';

interface Props {
  onClick: () => void;
}

export const AddSubject: React.FC<Props> = ({ onClick }) => {
  return (
    <div className="col d-flex justify-content-center">
      <div
        className="card shadow-sm d-flex justify-content-center align-items-center added-card"
        style={{
          width: '270px',
          height: 'auto',
          cursor: 'pointer',
          textAlign: 'center',
        }}
      >
        <div className="card-body d-flex flex-column justify-content-center align-items-center">
          <Button
            onClick={onClick}
            className="btn btn-link p-0 border-0 added"
            style={{ textDecoration: 'none' }}
          >
            <i className="bi bi-plus-circle fs-1 text-secondary mb-2"></i>
          </Button>

          <h5 className="card-text text-muted">Добавить предмет</h5>
        </div>
      </div>
    </div>
  );
};
