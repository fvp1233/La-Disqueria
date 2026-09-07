import { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { saveToken, readToken, clearToken } from '../api/client';
import * as authApi from '../api/auth';

const AuthContext = createContext(null);

const onboardingKey = 'ld_onboarding_seen';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);
  const [onboardingSeen, setOnboardingSeen] = useState(false);

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const seen = await AsyncStorage.getItem(onboardingKey);
        setOnboardingSeen(seen === 'true');

        const token = await readToken();
        if (token) {
          const profile = await authApi.getProfile();
          setUser(profile);
        }
      } catch (error) {
        await clearToken();
        setUser(null);
      } finally {
        setInitializing(false);
      }
    };

    bootstrap();
  }, []);

  const signIn = async (email, password) => {
    const data = await authApi.loginCustomer(email, password);
    await saveToken(data.token);
    setUser(data.user);
    return data.user;
  };

  const signOut = async () => {
    try {
      await authApi.logoutCustomer();
    } catch (error) {
      // El cierre local se hace de todas formas.
    }
    await clearToken();
    setUser(null);
  };

  const refreshProfile = async () => {
    const profile = await authApi.getProfile();
    setUser(profile);
    return profile;
  };

  const updateProfile = async (data) => {
    const result = await authApi.updateProfile(data);
    setUser((current) => ({ ...current, ...result.customer }));
    return result.customer;
  };

  const completeOnboarding = async () => {
    await AsyncStorage.setItem(onboardingKey, 'true');
    setOnboardingSeen(true);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        initializing,
        onboardingSeen,
        signIn,
        signOut,
        refreshProfile,
        updateProfile,
        completeOnboarding,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
}
