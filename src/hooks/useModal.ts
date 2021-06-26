import { useContext } from "react";
import { ModalContext } from "../context/Modal";

export default function useModal() {
  return useContext(ModalContext);
}