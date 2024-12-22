import React, { useState, useEffect } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';

interface Field {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

interface EditModalProps {
  show: boolean;
  title: string;
  fields: Field[];
  loading: boolean;
  onClose: () => void;
  onSave: () => void;
}

export const EditModal: React.FC<EditModalProps> = ({
  show,
  title,
  fields,
  loading,
  onClose,
  onSave,
}) => {
  const [errors, setErrors] = useState<boolean[]>(fields.map(() => false));

  useEffect(() => {
    if (!show) {
      setErrors(fields.map(() => false));
    }
  }, [show]);

  const validateFields = () => {
    const fieldErrors = fields.map(field => field.value.trim() === '');

    setErrors(fieldErrors);

    return fieldErrors.every(error => !error);
  };

  const handleSave = () => {
    if (validateFields()) {
      onSave();
    }
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          {fields.map((field, index) => (
            <Form.Group key={index} className="mb-3">
              <Form.Label>{field.label}</Form.Label>
              <Form.Control
                type={
                  field.label === 'Дедлайн задания'
                    ? 'datetime-local'
                    : 'textarea'
                }
                as={field.label === 'Дедлайн задания' ? undefined : 'textarea'}
                rows={field.label === 'Дедлайн задания' ? undefined : 3}
                value={field.value}
                onChange={e => {
                  field.onChange(e.target.value);
                  setErrors(
                    errors.map((error, i) => (i === index ? false : error)),
                  );
                }}
                isInvalid={errors[index]}
              />
              {errors[index] && (
                <Form.Control.Feedback type="invalid">
                  Поле не может быть пустым
                </Form.Control.Feedback>
              )}
            </Form.Group>
          ))}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Отмена
        </Button>
        <Button variant="primary" onClick={handleSave} disabled={loading}>
          {loading ? 'Сохранение...' : 'Сохранить'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
