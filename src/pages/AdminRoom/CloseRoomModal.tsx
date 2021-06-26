import closeImg from '../../assets/images/error.svg';
import Button from "../../components/Button";
import useModal from "../../hooks/useModal";
import useToast from '../../hooks/useToast';
import { firebase, database } from '../../services/firebase';

type CloseRoomModalProps = {
  roomId: string,
}

export default function CloseRoomModal({ roomId }: CloseRoomModalProps) {
  const { endModal } = useModal();
  const { activeToast } = useToast();

  async function handleConfirmClose() {
    await database.ref(`rooms/${roomId}`).update({
      closedAt: firebase.database.ServerValue.TIMESTAMP,
    })   
      .then(() => {
        endModal();
        activeToast({
          type: 'success',
          message: 'A sala foi fechada',
        });
      });
  }

  return (
    <div id="confirmation-modal">
      <img src={closeImg} alt="Icone de um circulo com um X" />
      <h2>Fechar sala</h2>
      <p>Tem certeza que você deseja fechar esta sala?</p>
      <div>
        <Button onClick={endModal}>Cancelar</Button>
        <Button onClick={handleConfirmClose}>Sim, fechar</Button>
      </div>
    </div>
  );
}