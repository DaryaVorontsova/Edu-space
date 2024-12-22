import React from 'react';
import { Button } from 'react-bootstrap';

interface Props {
  toggleShowPassword: () => void;
  showPassword: boolean;
}

export const EyePasswordButton: React.FC<Props> = ({
  toggleShowPassword,
  showPassword,
}) => {
  return (
    <Button
      onClick={toggleShowPassword}
      className="btn bg-transparent border-0 p-0 position-absolute"
      style={{
        color: '#6c757d',
        top: '50%',
        right: '20px',
      }}
    >
      <i className={`bi ${!showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
    </Button>
  );
};
