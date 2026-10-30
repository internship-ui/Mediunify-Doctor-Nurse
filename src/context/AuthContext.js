import React, { createContext, useContext, useState } from 'react';
import { doctor } from '../data/mockData';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authInitialRoute, setAuthInitialRoute] = useState('Splash');

  // Frontend-only mock. In a real app these would call your backend API.
  const register = (formData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (formData) {
          if (formData.name) doctor.name = formData.name;
          if (formData.email) doctor.email = formData.email;
          if (formData.phone) doctor.phone = formData.phone;
          if (formData.specialization) doctor.specialization = formData.specialization;
          if (formData.regNo) doctor.regNo = formData.regNo;
          if (formData.regCertificate) {
            doctor.regCertificate = formData.regCertificate;
          } else if (formData.regNo) {
            doctor.regCertificate = {
              name: `${formData.regNo.replace(/[^a-zA-Z0-9]/g, '_')}_Certificate.pdf`,
              size: '2.1 MB',
              uploadedDate: 'Just now',
              status: 'Under Super Admin Review',
              council: 'State / National Medical Council',
              issueDate: 'Recently Registered',
            };
          }
        }
        resolve({ success: true });
      }, 600);
    });
  };

  const login = (formData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        setIsAuthenticated(true);
        resolve({ success: true });
      }, 200);
    });
  };

  // Temporary: lets the doctor into the app while Super Admin verification
  // isn't wired up to a real backend yet. Remove this once verification is
  // live and require an approved status before setting isAuthenticated.
  const skipVerification = () => setIsAuthenticated(true);

  const logout = () => {
    setAuthInitialRoute('RoleSelectionScreen');
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        authInitialRoute,
        setAuthInitialRoute,
        register,
        login,
        logout,
        skipVerification,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
