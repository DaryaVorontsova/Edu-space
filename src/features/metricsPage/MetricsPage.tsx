import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Table } from 'react-bootstrap';
import {
  getStudentRegistrations,
  getMostPopularSubjects,
  getUserCounts,
} from './api';
import { Loading } from '../../components/Loading';

interface RegistrationData {
  [date: string]: number;
}

interface Subject {
  subjectId: string;
  studentCount: number;
}

interface UserCounts {
  student: number;
  teacher: number;
  admin: number;
}

export const MetricsPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [registrations, setRegistrations] = useState<RegistrationData | null>(
    null,
  );
  const [popularSubjects, setPopularSubjects] = useState<Subject[]>([]);
  const [userCounts, setUserCounts] = useState<UserCounts | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setLoading(true);
        setError(null);

        const [regData, subData, userData] = await Promise.all([
          getStudentRegistrations(),
          getMostPopularSubjects(),
          getUserCounts(),
        ]);

        setRegistrations(regData);
        setPopularSubjects(subData);
        setUserCounts(userData);
      } catch {
        setError('Error getting metrics');
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center">
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <p className="text-danger text-center">
        Ошибка получения статистики. Попробуйте позже
      </p>
    );
  }

  return (
    <Container>
      <h2 className="text-center mb-4">Статистика</h2>

      <Row className="mb-4">
        <Col md={4}>
          <Card body className="text-center">
            <h5>Ученики</h5>
            <h2>{userCounts?.student}</h2>
          </Card>
        </Col>
        <Col md={4}>
          <Card body className="text-center">
            <h5>Преподаватели</h5>
            <h2>{userCounts?.teacher}</h2>
          </Card>
        </Col>
        <Col md={4}>
          <Card body className="text-center">
            <h5>администраторы</h5>
            <h2>{userCounts?.admin}</h2>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <Card body>
            <h5>Регистрации учеников (по дням)</h5>
            <Table striped bordered hover className="mt-3">
              <thead>
                <tr>
                  <th>Дата</th>
                  <th>Число</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(registrations || {}).map(([date, count]) => (
                  <tr key={date}>
                    <td>{date}</td>
                    <td>{count}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card>
        </Col>

        <Col md={6}>
          <Card body>
            <h5>Самые популярные предметы</h5>
            <Table striped bordered hover className="mt-3">
              <thead>
                <tr>
                  <th>ID предмета</th>
                  <th>Количество учеников</th>
                </tr>
              </thead>
              <tbody>
                {popularSubjects.map(subject => (
                  <tr key={subject.subjectId}>
                    <td>{subject.subjectId}</td>
                    <td>{subject.studentCount}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};
