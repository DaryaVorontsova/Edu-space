import React from 'react';
import { Card } from 'react-bootstrap';

interface EvaluationProps {
  grade: string | null;
  feedback: string | null;
}

export const TeacherEvaluation: React.FC<EvaluationProps> = ({
  grade,
  feedback,
}) => {
  return (
    <div className="mt-3">
      <h5 className="mb-2">Оценка ответа</h5>
      <div className="container text-center mb-5">
        <div className="row border">
          <div className="col-4 p-3 bg-secondary text-white rounded-start">
            Оценка
          </div>
          <div className="col-8 p-3 bg-white text-dark rounded-end">
            {grade ? grade : 'Оценка пока не выставлена'}
          </div>
        </div>
      </div>
      <h5 className="mb-2">Отзыв преподавателя</h5>
      <Card className="d-flex justify-content-center align-items-center">
        <Card.Body className=" w-100 text-center">
          <p className="m-0">
            {feedback ? feedback : 'Отзыв преподавателя пока не предоставлен'}
          </p>
        </Card.Body>
      </Card>
    </div>
  );
};
