import { createContext, useState } from "react";

const AuthContext = createContext();

function AuthProvider({ children }) {
   const [user, setUser] = useState(null);
   console.log("AuthProvider user state:", user); 

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };