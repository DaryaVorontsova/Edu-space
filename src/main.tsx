import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import store from './app/store';
import App from './App';
import { logErrorToService } from './services/errorLogger';

window.onerror = (message, source, lineno, colno, error) => {
  logErrorToService(error, { context: 'Global Error Handler' });

  return true;
};

window.onunhandledrejection = event => {
  logErrorToService(event.reason, { context: 'Unhandled Rejection' });
};

const container = document.getElementById('root');

if (container) {
  const root = createRoot(container);

  root.render(
    <React.StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    </React.StrictMode>,
  );
} else {
  throw new Error(
    "Root element with ID 'root' was not found in the document. Ensure there is a corresponding HTML element with the ID 'root' in your HTML file.",
  );
}
