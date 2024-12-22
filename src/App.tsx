import React, { useEffect } from 'react';
import AppRoutes from './app/router';
import {
  BrowserRouter as Router,
  useNavigate,
  useLocation,
} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Navbar } from './components/Navbar';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { LoginForm } from './features/login/LoginForm';
import './assets/app.css';
import { useAppSelector, useAppDispatch } from './app/hooks';
import { selectIsAuthenticated } from './features/login/selectors';
import { fetchPermissions } from './features/permissions/thunks';
import { getProfile } from './features/profile/thunks';
import { ErrorBoundary } from './components/errorBoundary';

const MainLayout = () => {
  return (
    <div className="full-page">
      <div className="navbar-fixed">
        <Navbar />
      </div>
      <div className="main-part">
        <div className="header-fixed">
          <Header />
        </div>
        <div className="all">
          <div className="body-part">
            <AppRoutes />
          </div>
          <div className="footer-relocated">
            <Footer />
          </div>
        </div>
      </div>
    </div>
  );
};

const App = () => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchPermissions());

      dispatch(getProfile());
    }
  }, [dispatch, isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated && location.pathname !== '/login') {
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, location.pathname, navigate]);

  return isAuthenticated ? <MainLayout /> : <LoginForm />;
};

const AppWithRouter = () => (
  <ErrorBoundary>
    <Router>
      <App />
    </Router>
  </ErrorBoundary>
);

export default AppWithRouter;
