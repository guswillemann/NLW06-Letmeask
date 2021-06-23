import { useState } from "react";
import { createContext, ReactNode } from "react";
import theme from '../styles/theme.colors.module.scss';

type AppThemeContextData = () => void;

export const AppThemeContext = createContext({} as AppThemeContextData);

type AppThemeProviderProps = {
  children: ReactNode;
}

export default function AppThemeContextProvider({ children }: AppThemeProviderProps) {
  const [themeMode, setThemeMode] = useState('lightMode');

  function changeTheme() {
    const newThemeMode = themeMode === 'lightMode'
      ? 'darkMode'
      : 'lightMode'
  
    setThemeMode(newThemeMode)
  }

  return (
    <AppThemeContext.Provider value={changeTheme}>
      <div className={`app_container ${theme[themeMode]}`}>
        <button className={theme.themeButton} type="button" onClick={changeTheme}>Theme</button>
        {children}
      </div>
    </AppThemeContext.Provider>
  );
}
