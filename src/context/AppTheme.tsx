import { createContext, ReactNode, useEffect, useState } from "react";
import lightRaysImg from '../assets/images/light-rays.svg';

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
  }, [themeMode])
  
  function changeTheme() {
    const newThemeMode = themeMode === 'lightMode'
      ? 'darkMode'
      : 'lightMode';
    
    document.body.classList.remove(themeMode);
    localStorage.setItem('theme', newThemeMode)
    setThemeMode(newThemeMode)
  }

  return (
    <AppThemeContext.Provider value={changeTheme}>
      <button className="themeButton" type="button" onClick={changeTheme}>
        <svg className="themeLamp" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M6 23H18M12 23V12.5M12 12.5H1.5L5.50257 2.2712C5.80258 1.50451 6.54176 1 7.36506 1H16.6349C17.4582 1 18.1974 1.50451 18.4974 2.2712L22.5 12.5H12Z" stroke="#737380" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <img className="themeRays" src={lightRaysImg} alt="Raios de luz" />
      </button>
      {children}
    </AppThemeContext.Provider>
  );
}
