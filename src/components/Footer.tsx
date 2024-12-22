import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer
      className="d-flex flex-wrap justify-content-between align-items-center py-3 border-top"
      style={{ margin: '0 10px' }}
    >
      <div className="col-md-4 d-flex align-items-center">
        <span className="mb-3 mb-md-0 text-body-secondary">
          &copy; 2024 Darya Vorontsova
        </span>
      </div>

      <ul className="nav col-md-4 justify-content-end list-unstyled d-flex">
        <li className="ms-3">
          <a
            className="text-body-secondary"
            href="https://t.me/darya_vorontsova"
          >
            <i className="bi bi-telegram" style={{ fontSize: 24 }}></i>
          </a>
        </li>
        <li className="ms-3">
          <a
            className="text-body-secondary"
            href="https://github.com/DaryaVorontsova"
          >
            <i className="bi bi-github" style={{ fontSize: 24 }}></i>
          </a>
        </li>
      </ul>
    </footer>
  );
};
