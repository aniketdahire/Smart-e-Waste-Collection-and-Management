import React, { createContext, useContext, useState, useCallback } from 'react';
import Toast from '../components/common/Toast';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 3000, position = 'top-right') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type, duration, position }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const toast = {
    success: (msg, duration, position) => addToast(msg, 'success', duration, position),
    error: (msg, duration, position) => addToast(msg, 'error', duration, position),
    info: (msg, duration, position) => addToast(msg, 'info', duration, position),
    warning: (msg, duration, position) => addToast(msg, 'warning', duration, position),
  };

  const positions = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'top-center': 'top-4 left-1/2 -translate-x-1/2',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      {Object.entries(positions).map(([pos, classes]) => (
          <div key={pos} className={`fixed z-50 flex flex-col gap-2 pointer-events-none ${classes}`}>
            {toasts
              .filter((t) => t.position === pos || (!t.position && pos === 'top-right'))
              .map((t) => (
              <div key={t.id} className="pointer-events-auto">
                 <Toast
                    message={t.message}
                    type={t.type}
                    duration={t.duration}
                    onClose={() => removeToast(t.id)}
                 />
              </div>
            ))}
          </div>
      ))}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
