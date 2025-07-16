import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import Snackbar, { SnackbarType } from "../components/ui/Snackbar";

interface SnackbarMessage {
  id: string;
  message: string;
  type: SnackbarType;
  duration?: number;
}

interface SnackbarContextType {
  showSnackbar: (message: string, type: SnackbarType, duration?: number) => void;
  showSuccess: (message: string, duration?: number) => void;
  showError: (message: string, duration?: number) => void;
  showWarning: (message: string, duration?: number) => void;
  showInfo: (message: string, duration?: number) => void;
  hideSnackbar: (id: string) => void;
  showBatchSuccess: (count: number, action: string, target?: string) => void;
}

const SnackbarContext = createContext<SnackbarContextType | undefined>(undefined);

export const useSnackbar = (): SnackbarContextType => {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error("useSnackbar must be used within a SnackbarProvider");
  }
  return context;
};

interface SnackbarProviderProps {
  children: ReactNode;
}

export const SnackbarProvider: React.FC<SnackbarProviderProps> = ({ children }) => {
  const [snackbars, setSnackbars] = useState<SnackbarMessage[]>([]);

  const generateId = useCallback(() => {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }, []);

  const showSnackbar = useCallback((message: string, type: SnackbarType, duration?: number) => {
    const id = generateId();
    const newSnackbar: SnackbarMessage = {
      id,
      message,
      type,
      duration,
    };

    setSnackbars((prev) => [...prev, newSnackbar]);
  }, [generateId]);

  const hideSnackbar = useCallback((id: string) => {
    setSnackbars((prev) => prev.filter((snackbar) => snackbar.id !== id));
  }, []);

  const showSuccess = useCallback((message: string, duration?: number) => {
    showSnackbar(message, "success", duration);
  }, [showSnackbar]);

  const showError = useCallback((message: string, duration?: number) => {
    showSnackbar(message, "error", duration);
  }, [showSnackbar]);

  const showWarning = useCallback((message: string, duration?: number) => {
    showSnackbar(message, "warning", duration);
  }, [showSnackbar]);

  const showInfo = useCallback((message: string, duration?: number) => {
    showSnackbar(message, "info", duration);
  }, [showSnackbar]);

  const showBatchSuccess = useCallback((count: number, action: string, target?: string) => {
    if (count === 0) return;
    if (count === 1) {
      showSuccess(`1 track ${action}${target ? ` ${target}` : ''}`);
      return;
    }
    showSuccess(`${count} tracks ${action}${target ? ` ${target}` : ''}`);
  }, [showSuccess]);

  const contextValue: SnackbarContextType = {
    showSnackbar,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    hideSnackbar,
    showBatchSuccess,
  };

  return (
    <SnackbarContext.Provider value={contextValue}>
      {children}
      {/* Render snackbars with stacking */}
      <div className="fixed bottom-4 right-4 z-50 space-y-2">
        {snackbars.map((snackbar, index) => (
          <div
            key={snackbar.id}
            style={{
              transform: `translateY(${-index * 60}px)`,
              zIndex: 1000 - index,
            }}
            className="transition-transform duration-300 ease-in-out">
            <Snackbar
              message={snackbar.message}
              type={snackbar.type}
              isVisible={true}
              onClose={() => hideSnackbar(snackbar.id)}
              duration={snackbar.duration}
            />
          </div>
        ))}
      </div>
    </SnackbarContext.Provider>
  );
};