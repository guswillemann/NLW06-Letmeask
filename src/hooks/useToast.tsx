import { useContext } from "react";
import { ToastContext } from "../context/Toast";

export default function useToast() {
  return useContext(ToastContext);
}
