import { useState } from "react";
import { useEffect } from "react";
import { createContext, ReactNode } from "react";
import lampImg from '../assets/images/lamp.svg';
import lightRaysImg from '../assets/images/light-rays.svg';

// import theme from '../styles/theme.colors.module.scss';

type AppThemeContextData = () => void;

export const AppThemeContext = createContext({} as AppThemeContextData);

type AppThemeProviderProps = {
  children: ReactNode;
}

export default function AppThemeContextProvider({ children }: AppThemeProviderProps) {
  const [themeMode, setThemeMode] = useState(() => {
    const storedTheme = localStorage.getItem('theme');
    return storedTheme ?? 'lightMode';
  });

  useEffect(() => {
    document.body.classList.add(themeMode);
    localStorage.setItem('theme', themeMode)
  }, [themeMode])
  
  function changeTheme() {
    const newThemeMode = themeMode === 'lightMode'
    ? 'darkMode'
    : 'lightMode'
    
    document.body.classList.remove(themeMode);
    setThemeMode(newThemeMode)
  }

  return (
    <AppThemeContext.Provider value={changeTheme}>
      <button className="themeButton" type="button" onClick={changeTheme}>
        <img className="themeLamp" src={lampImg} alt="Abajur" />
        <img className="themeRays" src={lightRaysImg} alt="Raios de luz" />
      </button>
      {children}
    </AppThemeContext.Provider>
  );
}
