import cName from "classnames";
import { useState } from "react";
import { createContext, ReactNode } from "react";
import successImg from '../assets/images/success.svg';
import alertImg from '../assets/images/alert.svg';
import errorImg from '../assets/images/error.svg';

import '../styles/toast.scss';
import { useCallback } from "react";

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
  success: successImg,
  alert: alertImg,
  error: errorImg,
}

export default function ToastContextProvider({ children }: ToastContextProviderProps) {
  const [toastObject, setToastObject] = useState<ToastObject | null>();
  const activeToast = useCallback((toast: ToastObject) => {
    setToastObject(toast)
    setTimeout(() => setToastObject(null), 3000);
  }, [])

  return (
    <ToastContext.Provider value={{
      activeToast,
    }}>
      {toastObject && <div
        id="toast-container"
        className={cName(
          { 'success-toast': toastObject?.type === 'success'},
          { 'alert-toast': toastObject?.type === 'alert'},
          { 'error-toast': toastObject?.type === 'error' },
        )}>
          <img src={toastImgMap[toastObject?.type]} alt="sucesso" />
          <span>{toastObject?.message}</span>
      </div>}
      {children}
    </ToastContext.Provider>
  );
}
