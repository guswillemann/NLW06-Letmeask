import { createContext, MouseEvent, ReactNode, useCallback, useState } from "react";
import '../styles/modal.scss';


type ModalContextData = {
  activeModal: (modal: ReactNode) => void;
  endModal: () => void;
}

export const ModalContext = createContext({} as ModalContextData);

type ModalCOntextProviderProps = {
  children: ReactNode;
}

type CloseModalEvent = MouseEvent<HTMLDivElement> & {
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

  function closeModal(event: CloseModalEvent) {
    const eventTargetId = event.target.id;
    if (eventTargetId !== 'modal-container') return;

    setIsVisible(false);
  }

  function endModal() {
    setModalContent(null);
    setIsVisible(false);
  }

  return (
    <ModalContext.Provider value={{
      activeModal,
      endModal,
    }}>
      {isVisible && (
        <div onClick={closeModal} id="modal-container">
          {modalContent}
        </div>
      )}
      {children}
    </ModalContext.Provider>
  );
}
