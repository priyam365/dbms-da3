import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (message, type = 'info', title = null, duration = 4000) => {
      const id = Date.now() + Math.random().toString(36).substring(2, 9);
      const newToast = { id, message, type, title };
      setToasts((prev) => [...prev, newToast]);

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
    },
    [removeToast]
  );

  return (
    <ToastContext.Provider value={{ showToast, removeToast }}>
      {children}
      <div className="toast-container" aria-live="polite">
        {toasts.map((toast) => {
          let Icon = Info;
          let defaultTitle = 'Notification';
          if (toast.type === 'success') {
            Icon = CheckCircle2;
            defaultTitle = 'Success';
          } else if (toast.type === 'error') {
            Icon = AlertCircle;
            defaultTitle = 'Error';
          } else if (toast.type === 'warning') {
            Icon = AlertTriangle;
            defaultTitle = 'Warning';
          }

          return (
            <div
              key={toast.id}
              className={`toast toast-${toast.type}`}
              role="alert"
            >
              <Icon size={20} className={`toast-icon-${toast.type}`} />
              <div className="toast-content">
                <div className="toast-title">{toast.title || defaultTitle}</div>
                <div className="toast-message">{toast.message}</div>
              </div>
              <button
                type="button"
                className="toast-close"
                onClick={() => removeToast(toast.id)}
                aria-label="Close notification"
              >
                <X size={16} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    // Graceful fallback if used outside provider
    return {
      showToast: (msg) => console.log('Toast:', msg),
      removeToast: () => {},
    };
  }
  return context;
}

export default ToastProvider;
