import cName from "classnames";
import { useState } from "react";
import { createContext, ReactNode } from "react";
import AlertIcon from "../components/icons/AlertIcon";
import ErrorIcon from "../components/icons/ErrorIcon";
import SuccessIcon from "../components/icons/SuccessIcon";

import '../styles/toast.scss';
import { useCallback } from "react";
import { useEffect } from "react";

type ToastContextData = {
  activeToast: (toast: ToastObject) => void,
}

export const ToastContext = createContext({} as ToastContextData);

type ToastContextProviderProps = {
  children: ReactNode;
}

type ToastObject = {
  type: 'success' | 'alert' | 'error';
  message: string;
}

const toastImgMap = {
  success: <SuccessIcon />,
  alert: <AlertIcon />,
  error: <ErrorIcon />,
}

export default function ToastContextProvider({ children }: ToastContextProviderProps) {
  const [toastObject, setToastObject] = useState<ToastObject | null>();
  const activeToast = useCallback((toast: ToastObject) => setToastObject(toast), [])
  
  useEffect(() => {
    const timeoutId = setTimeout(() => {setToastObject(null)}, 3000);
    return () => clearTimeout(timeoutId);
  }, [toastObject])

  return (
    <ToastContext.Provider value={{
      activeToast,
    }}>
      {toastObject && <div
        key={Date.now()}
        id="toast-container"
        className={cName(
          { 'success-toast': toastObject?.type === 'success'},
          { 'alert-toast': toastObject?.type === 'alert'},
          { 'error-toast': toastObject?.type === 'error' },
        )}>
          {toastImgMap[toastObject?.type]}
          <span>{toastObject?.message}</span>
      </div>}
      {children}
    </ToastContext.Provider>
  );
}
