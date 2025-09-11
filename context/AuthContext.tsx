import { createContext, useState } from "react";
import { User } from "./common.type";

interface AuthContextProps {
  user: User | null;
  login: (username: string, password: string) => boolean;
  register: (user: User) => void;
  resetPassword: () => void;
}

const fakeDataSource = {
  users: [
    {
      email: "test@test.com",
      username: "test",
      name: "test",
      lastName: "test",
      age: 23,
    },
  ],
  passwords: [
    {
      username: "test",
      password: "test",
    },
  ],
};

export const AuthContext = createContext({} as AuthContextProps);
export const AuthProvider = ({ children }: any) => {
  // variables
  const [user, setUser] = useState(null as any);

  // funciones
  const login = (username: string, password: string) => {
    const userExist = fakeDataSource.passwords.find(
      (value) => value.username === username && value.password === password
    );
    if (userExist) {
      setUser(userExist);
      return true;
    }
    return false;
  };
  const register = (user: User) => {};
  const resetPassword = () => {};

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
