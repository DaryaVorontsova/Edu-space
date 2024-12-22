import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Dashboard } from '../features/dashboard/Dashboard';
import { SubjectView } from '../features/subjectView/SubjectView';
import { LoginForm } from '../features/login/LoginForm';
import { Profile } from '../features/profile/Profile';
import { AssignmentView } from '../features/assignmentView/AssignmentView';
import { NotFound } from '../components/NotFound';
import { CreateUser } from '../features/createUser/CreateUser';
import { MetricsPage } from '../features/metricsPage/MetricsPage';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginForm />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/createUser" element={<CreateUser />} />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/metrics" element={<MetricsPage />} />
      <Route path="/dashboard/subject/:id_subject" element={<SubjectView />} />
      <Route
        path="/dashboard/subject/:subjectId/assignments/:assignmentId"
        element={<AssignmentView />}
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
