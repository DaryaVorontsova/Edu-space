import React from 'react';
import { Link } from 'react-router-dom';
import { useAppSelector } from '../app/hooks';
import {
  selectUserProfile,
  selectProfileLoading,
} from '../features/profile/selectors';
import { Loading } from './Loading';
import '../assets/app.css';

export const Header: React.FC = () => {
  const userProfile = useAppSelector(selectUserProfile);
  const profileLoading = useAppSelector(selectProfileLoading);

  return (
    <div className="container">
      <header className="d-flex flex-column flex-md-row justify-content-between align-items-center py-3 mb-4 border-bottom">
        <div
          className="d-flex align-items-center justify-content-center w-100 w-md-auto text-center"
          style={{ marginLeft: '7%' }}
        >
          <img
            className="img-star user-info"
            width="30"
            src="/star-fill.svg"
            alt="star"
          />
          <h2 className="mb-0 fs-2 fs-md-3">
            <span className="d-none d-md-inline">
              EduSpace - простая LMS система
            </span>
            <span className="d-inline d-md-none">EduSpace</span>
          </h2>
        </div>
        <div className="d-flex align-items-center user-info">
          <Link
            to="/profile"
            className="d-flex align-items-center text-decoration-none"
          >
            {profileLoading ? (
              <Loading />
            ) : (
              <h5 className="mb-0 me-3 text-center" style={{ color: '#000' }}>
                {`${userProfile.lastName} ${userProfile.firstName}${
                  userProfile.middleName ? ` ${userProfile.middleName}` : ''
                }`}
              </h5>
            )}
            <img
              className="mb-0"
              width="50"
              src="/user.svg"
              alt="user profile"
            />
          </Link>
        </div>
      </header>
    </div>
  );
};
