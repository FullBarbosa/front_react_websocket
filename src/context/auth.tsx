/* eslint-disable no-shadow */
import {
  createContext, ReactNode, useEffect, useState,
} from 'react';
import { api } from '../service/api';

interface IAuthResponse {
  token: string;
  user: {
    id: string;
    avatar_url: string;
    name: string;
    login: string;
  };
}

interface IUser {
  id: string;
  name: string;
  login: string;
  avatar_url: string;
}

interface IAuthContextData {
  user: IUser | null;
  signInUrl: string;
  signOut: () => void;
}

interface IAuthProvider {
  children: ReactNode;
}

export const AuthContext = createContext({} as IAuthContextData);

export function AuthProvider({ children }: IAuthProvider) {
  const [user, setUser] = useState<IUser | null>(null);

  const signInUrl = `${import.meta.env.VITE_APP_GITHUB_AUTH_URL}${
    import.meta.env.VITE_APP_GITHUB_CLIENT_ID
  }`;

  async function signIn(githubCode: string) {
    const response = await api.post<IAuthResponse>('authenticate', {
      code: githubCode,
    });

    const { token, user } = response.data;

    localStorage.setItem('@token', token);
    setUser(user);
    api.defaults.headers.common.authorization = `Bearer ${token}`;
  }

  function signOut() {
    setUser(null);
    localStorage.removeItem('@token');
  }

  useEffect(() => {
    const token = localStorage.getItem('@token');
    if (token) {
      api.defaults.headers.common.authorization = `Bearer ${token}`;
      api.get<IUser>('profile').then((response) => {
        setUser(response.data);
      });
    }
  }, []);

  useEffect(() => {
    const url = window.location.href;
    const hasGitHubCode = url.includes('?code=');

    if (hasGitHubCode) {
      const [urlWithoutCode, githubCode] = url.split('?code=');

      window.history.pushState({}, '', urlWithoutCode);

      signIn(githubCode);
    }
  }, []);

  // const valueContext = useMemo<IAuthContextData>(
  //   () => ({ signInUrl, user, signOut }),
  //   [user, signOut],
  // );

  return (

    // eslint-disable-next-line react/jsx-no-constructed-context-values
    <AuthContext.Provider value={{ signInUrl, user, signOut }}>
      { children }
    </AuthContext.Provider>
  );
}
