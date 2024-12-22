import React from 'react';
import { Button } from 'react-bootstrap';

interface EditButtonProps {
  onClick: () => void;
}

export const EditButton: React.FC<EditButtonProps> = ({ onClick }) => (
  <Button variant="outline-primary" size="sm" onClick={onClick}>
    <i className="bi bi-pencil"></i>
  </Button>
);
