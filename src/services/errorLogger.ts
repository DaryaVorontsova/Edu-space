import axios from 'axios';
import { BASE_API_URL } from '../config';

interface ErrorPayload {
  error: string;
  stack: string | null;
  errorInfo?: Record<string, unknown>;
  timestamp: string;
}

export const logErrorToService = async (
  error: unknown,
  errorInfo?: Record<string, unknown>,
): Promise<void> => {
  const payload: ErrorPayload = {
    error: error instanceof Error ? error.message : String(error),
    stack: error instanceof Error && error.stack ? error.stack : null,
    errorInfo: errorInfo ?? {},
    timestamp: new Date().toISOString(),
  };

  try {
    await axios.post(`${BASE_API_URL}/api/logs/error`, payload, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (loggingError) {
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.error('Failed to log error to server:', loggingError);
    }
  }
};
