import { createContext, MouseEvent, ReactNode, useCallback, useState } from "react";
import '../styles/modal.scss';


type ModalContextData = {
  activeModal: (modal: ReactNode) => void;
  endModal: () => void;
  closeModal: () => void;
}

export const ModalContext = createContext({} as ModalContextData);

type ModalCOntextProviderProps = {
  children: ReactNode;
}

type ModalClickEvent = MouseEvent<HTMLDivElement> & {
  target: {
    id: string,
  }
}

export default function ModalContextProvider({ children }: ModalCOntextProviderProps) {
  const [modalContent, setModalContent] = useState<ReactNode | null>();
  const [isVisible, setIsVisible] = useState(false);
  const activeModal = useCallback((content: ReactNode) => {
    setModalContent(content);
    setIsVisible(true);
  }, [])

  function closeModal() {
    setIsVisible(false);
  }

  function endModal() {
    setModalContent(null);
    setIsVisible(false);
  }

  function handleContanierClick(event: ModalClickEvent) {
    if (event.target.id === 'modal-container') closeModal();
  }

  return (
    <ModalContext.Provider value={{
      activeModal,
      endModal,
      closeModal,
    }}>
      {modalContent && (
        <div
          onClick={handleContanierClick}
          id="modal-container"
          className={isVisible ? '' : 'hidden'}
        >
          {modalContent}
        </div>
      )}
      {children}
    </ModalContext.Provider>
  );
}
