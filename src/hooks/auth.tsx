import React, { createContext, useCallback, useState, useContext } from 'react';
import api from '../services/api';

interface User {
  id: string;
  name: string;
  avatar_url: string;
}

interface AuthState {
  token: string;
  user: User;
}

interface SignInInputDTO {
  email: string;
  password: string;
}

type SignInOutputDTO = Promise<void>;

interface AuthContext {
  user: User;
  signIn(input: SignInInputDTO): SignInOutputDTO;
  signOut(): void;
}

const Context = createContext<AuthContext>({} as AuthContext);

export function useAuth(): AuthContext {
  const context = useContext(Context);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}

export const AuthProvider: React.FC = ({children}) => {
  const [data, setData] = useState<AuthState>(() => {
    const token = localStorage.getItem('@GoBarber:token');
    const user = localStorage.getItem('@GoBarber:user');

    if (token && user) {
      return {token, user: JSON.parse(user)};
    } else {
      return {} as AuthState;
    }
  });

  const signIn = useCallback(async ({email, password}) => {
    const {data} = await api.post('sessions', {email, password});

    const {token, user} = data;
    localStorage.setItem('@GoBarber:token', token);
    localStorage.setItem('@GoBarber:user', JSON.stringify(user));

    setData({token, user})
  }, []);

  const signOut = useCallback(() => {
    localStorage.removeItem('@GoBarber:token');
    localStorage.removeItem('@GoBarber:user');

    setData({} as AuthState);
  }, []);

  return (
    <Context.Provider value={{user: data.user, signIn, signOut}}>
      {children}
    </Context.Provider>
  );
};
