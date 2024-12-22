import React from 'react';
import { Button } from 'react-bootstrap';

interface DeleteButtonProps {
  onClick: () => void;
}

export const DeleteButton: React.FC<DeleteButtonProps> = ({ onClick }) => (
  <Button variant="outline-danger" size="sm" onClick={onClick} className="ms-2">
    <i className="bi bi-trash"></i>
  </Button>
);
