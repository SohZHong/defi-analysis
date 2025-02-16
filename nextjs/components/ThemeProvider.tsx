'use client';

import * as React from 'react';
import {
  ThemeProvider as NextThemesProvider,
  type ThemeProviderProps,
} from 'next-themes';
import { HeroUIProvider } from '@heroui/system';

export const ThemeProvider = ({ children, ...props }: ThemeProviderProps) => {
  return (
    <HeroUIProvider>
      <NextThemesProvider {...props}>{children}</NextThemesProvider>
    </HeroUIProvider>
  );
};
