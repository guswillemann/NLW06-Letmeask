import { useContext } from "react";
import { AppThemeContext } from "../context/AppTheme";

export default function useAppTheme() {
  return useContext(AppThemeContext);
}
