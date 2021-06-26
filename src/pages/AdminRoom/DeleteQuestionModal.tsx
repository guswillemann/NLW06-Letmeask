import DeleteIcon from '../../components/icons/DeleteIcon';
import Button from "../../components/Button";
import useModal from "../../hooks/useModal";
import { database } from '../../services/firebase';
import useToast from '../../hooks/useToast';

type DeleteQuestionModalProps = {
  roomId: string,
  questionId: string,
}

export default function DeleteQuestionModal({ roomId, questionId }: DeleteQuestionModalProps) {
  const { endModal } = useModal();
  const { activeToast } = useToast();

  async function handleConfirmDelete() {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).remove()
      .then(() => {
        endModal();
        activeToast({
          type: 'success',
          message: 'A pergunta foi deletada',
        });
      });
  }

  return (
  <div id="confirmation-modal">
      <DeleteIcon />
      <h2>Excluir pergunta</h2>
      <p>Tem certeza que você deseja excluir esta pergunta?</p>
      <div>
        <Button onClick={endModal}>Cancelar</Button>
        <Button onClick={handleConfirmDelete}>Sim, excluir</Button>
      </div>
    </div>
  );
}