import React, { createContext, useContext, useCallback, useState } from 'react';
import { uuid } from 'uuidv4';

import ToastContainer from '../components/ToastContainer';

export interface ToastMessage {
  id: string;
  type?: 'success' | 'error' | 'info';
  title: string;
  description?: string;
}

interface ToastContext {
  addToast(message: Omit<ToastMessage, 'id'>): void;
  removeToast(id: string): void;
}

const Context = createContext<ToastContext>({} as ToastContext);

export function useToast(): ToastContext {
  const context = useContext(Context);

  if (!context) {
    throw new Error('useToast must be used within an ToastProvider');
  }

  return context;
}

export const ToastProvider: React.FC = ({children}) => {
  const [messages, setMessages] = useState<ToastMessage[]>([]);

  const addToast = useCallback((message: Omit<ToastMessage, 'id'>) => {
    const id = uuid();
    const toast = {...message, id};

    setMessages(oldValue => [...oldValue, toast]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setMessages(oldValue => oldValue.filter(message => message.id !== id));
  }, []);

  return (
    <Context.Provider value={{addToast, removeToast}}>
      {children}
      <ToastContainer messages={messages} />
    </Context.Provider>
  );
};
