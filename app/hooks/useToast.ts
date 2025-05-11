"use client";

import { useToast as useChakraToast } from '@chakra-ui/react';

type ToastStatus = 'info' | 'warning' | 'success' | 'error';

interface ToastOptions {
  title?: string;
  description?: string;
  status?: ToastStatus;
  duration?: number;
  isClosable?: boolean;
}

export const useToast = () => {
  const toast = useChakraToast();

  const showToast = ({
    title,
    description,
    status = 'info',
    duration = 5000,
    isClosable = true,
  }: ToastOptions) => {
    toast({
      title,
      description,
      status,
      duration,
      isClosable,
      position: 'top-right',
    });
  };

  return {
    showToast,
    showSuccess: (options: Omit<ToastOptions, 'status'>) =>
      showToast({ ...options, status: 'success' }),
    showError: (options: Omit<ToastOptions, 'status'>) =>
      showToast({ ...options, status: 'error' }),
    showWarning: (options: Omit<ToastOptions, 'status'>) =>
      showToast({ ...options, status: 'warning' }),
    showInfo: (options: Omit<ToastOptions, 'status'>) =>
      showToast({ ...options, status: 'info' }),
  };
}; 