import type { Middleware } from '@reduxjs/toolkit';
import { logErrorToService } from '../../services/errorLogger';

export const errorLoggerMiddleware: Middleware = () => next => action => {
  try {
    return next(action);
  } catch (error) {
    logErrorToService(error);
    throw error;
  }
};
