import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import authService from '../api/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSplashLoading, setIsSplashLoading] = useState(true);

  const checkLoginState = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const info = await AsyncStorage.getItem('userInfo');
      const expiry = await AsyncStorage.getItem('sessionExpiry');

      if (token && info && expiry) {
        const expiryTime = parseInt(expiry, 10);
        if (new Date().getTime() < expiryTime) {
          setUserToken(token);
          setUserInfo(JSON.parse(info));
        } else {
          await AsyncStorage.removeItem('userToken');
          await AsyncStorage.removeItem('userInfo');
          await AsyncStorage.removeItem('sessionExpiry');
        }
      }
    } catch (error) {
      console.log('Error reading storage', error);
    } finally {
      setIsSplashLoading(false);
    }
  };

  useEffect(() => {
    checkLoginState();
  }, []);

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const data = await authService.login({ email, password });
      await _saveSession(data);
      return { success: true };
    } catch (error) {
      setIsLoading(false);
      return { success: false, message: error.message || 'Login failed' };
    }
  };

  const requestSignupOtp = async (full_name, email, password) => {
    setIsLoading(true);
    try {
      const data = await authService.requestSignupOtp({ full_name, email, password });
      setIsLoading(false);
      return { success: true, message: data.message };
    } catch (error) {
      setIsLoading(false);
      return { success: false, message: error.message || 'Failed to request OTP' };
    }
  };

  const verifyAndRegister = async (email, otp) => {
    setIsLoading(true);
    try {
      const data = await authService.verifyAndRegister({ email, otp });
      await _saveSession(data);
      return { success: true };
    } catch (error) {
      setIsLoading(false);
      return { success: false, message: error.message || 'Verification failed' };
    }
  };

  const requestPasswordReset = async (email) => {
    setIsLoading(true);
    try {
      const data = await authService.requestPasswordReset(email);
      setIsLoading(false);
      return { success: true, message: data.message };
    } catch (error) {
      setIsLoading(false);
      return { success: false, message: error.message || 'Failed to request reset' };
    }
  };

  const resetPassword = async (email, otp, newPassword) => {
    setIsLoading(true);
    try {
      const data = await authService.resetPassword({ email, otp, newPassword });
      setIsLoading(false);
      return { success: true, message: data.message };
    } catch (error) {
      setIsLoading(false);
      return { success: false, message: error.message || 'Reset failed' };
    }
  };

  const googleLogin = async (idToken) => {
    setIsLoading(true);
    try {
      const data = await authService.googleLogin(idToken);
      await _saveSession(data);
      return { success: true };
    } catch (error) {
      setIsLoading(false);
      return { success: false, message: error.message || 'Google Login failed' };
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userInfo');
      await AsyncStorage.removeItem('sessionExpiry');
      setUserToken(null);
      setUserInfo(null);
    } catch (error) {
      console.log('Error logging out', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to save session
  const _saveSession = async (data) => {
    const expiryTime = new Date().getTime() + 24 * 60 * 60 * 1000;
    setUserToken(data.token);
    setUserInfo(data);
    await AsyncStorage.setItem('userToken', data.token);
    await AsyncStorage.setItem('userInfo', JSON.stringify(data));
    await AsyncStorage.setItem('sessionExpiry', expiryTime.toString());
    setIsLoading(false);
  };

  return (
    <AuthContext.Provider
      value={{
        login,
        requestSignupOtp,
        verifyAndRegister,
        requestPasswordReset,
        resetPassword,
        googleLogin,
        logout,
        userToken,
        userInfo,
        isLoading,
        isSplashLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
