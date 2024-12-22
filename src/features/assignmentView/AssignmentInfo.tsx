import React, { useState, useEffect } from 'react';
import { Card, Row, Col } from 'react-bootstrap';

interface AssignmentProps {
  name: string;
  description: string;
  deadline: string;
  setIsDeadlineExpired: (expired: boolean) => void;
}

export const AssignmentInfo: React.FC<AssignmentProps> = ({
  name,
  description,
  deadline,
  setIsDeadlineExpired,
}) => {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const deadlineDate = new Date(deadline);

    const updateTimeLeft = () => {
      const now = new Date();
      const difference = deadlineDate.getTime() - now.getTime();

      if (difference <= 0) {
        setTimeLeft('Время истекло');
        setIsDeadlineExpired(true);
      } else {
        const hours = Math.floor(difference / (1000 * 60 * 60));
        const minutes = Math.floor(
          (difference % (1000 * 60 * 60)) / (1000 * 60),
        );
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft(`${hours} ч ${minutes} мин ${seconds} сек`);
        setIsDeadlineExpired(false);
      }
    };

    updateTimeLeft();

    const timerId = setInterval(updateTimeLeft, 1000);

    return () => clearInterval(timerId);
  }, [deadline]);

  const formattedDeadline = new Date(deadline).toLocaleString();

  const timerClass =
    timeLeft === 'Время истекло'
      ? 'bg-danger-subtle text-dark'
      : 'bg-success-subtle text-dark';

  return (
    <>
      <h3 className="text-center mt-3 mb-4">{name}</h3>
      <Row>
        <Col md={8}>
          <p className="mb-4">
            <strong>Описание задания:</strong> {description}
          </p>
        </Col>

        <Col md={4}>
          <Card className="d-flex justify-content-center align-items-center">
            <Card.Body className=" w-100 text-center">
              <div className="d-flex flex-row justify-content-center align-items-center gap-2">
                <i className="bi bi-bell"></i>
                <h6 className="m-0">Дедлайн</h6>
              </div>
              <p className="mb-0">{formattedDeadline}</p>
              <p className={`p-3 rounded m-0 ${timerClass}`}>
                До дедлайна: {timeLeft}
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};
