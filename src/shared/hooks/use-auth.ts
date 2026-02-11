"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  setCredentials,
  setUser,
  logout,
  initializeAuth,
  setInitialized,
} from "@/features/auth/auth-slice";
import { useLazyGetMeQuery } from "@/features/auth/auth-api";
import { API_AUTH } from "@/shared/constants/api-urls";
import type { User } from "@/features/auth/types";

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { user, token, isAuthenticated, isLoading, isInitialized, error } = useAppSelector(
    (state) => state.auth
  );
  const [getMe] = useLazyGetMeQuery();
  const initializingRef = useRef(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const lastLoginAttemptRef = useRef<number>(0);

  useEffect(() => {
    const initAuth = async () => {
      // Skip if already initialized or currently initializing
      if (isInitialized || initializingRef.current) return;

      initializingRef.current = true;
      dispatch(initializeAuth());

      const storedToken = localStorage.getItem("token");

      if (storedToken) {
        try {
          const userData = await getMe().unwrap();
          dispatch(setUser(userData));
        } catch {
          dispatch(logout());
        }
      } else {
        dispatch(setInitialized());
      }

      initializingRef.current = false;
    };

    initAuth();
  }, [dispatch, getMe, isInitialized]);

  const handleLogin = () => {
    const now = Date.now();
    const timeSinceLastAttempt = now - lastLoginAttemptRef.current;
    const cooldownPeriod = 3000; // 3 saniye

    // Rate limiting kontrolü
    if (timeSinceLastAttempt < cooldownPeriod) {
      const remainingSeconds = Math.ceil((cooldownPeriod - timeSinceLastAttempt) / 1000);
      toast.warning("Çok hızlı tıklıyorsunuz", {
        description: `Lütfen ${remainingSeconds} saniye bekleyin.`,
      });
      return;
    }

    // Zaten yönlendirme yapılıyorsa tekrar yapma
    if (isRedirecting) {
      toast.info("Giriş sayfasına yönlendiriliyorsunuz...");
      return;
    }

    lastLoginAttemptRef.current = now;
    setIsRedirecting(true);

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
    window.location.href = `${apiUrl}${API_AUTH.GOOGLE}`;
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleSetCredentials = (userData: User, authToken: string) => {
    dispatch(setCredentials({ user: userData, token: authToken }));
  };

  return {
    user,
    token,
    isAuthenticated,
    isLoading: isLoading || isRedirecting,
    isInitialized,
    error,
    login: handleLogin,
    logout: handleLogout,
    setCredentials: handleSetCredentials,
  };
};
