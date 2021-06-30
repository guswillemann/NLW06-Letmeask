import { useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import Logo from '../../components/Logo';
import Button from '../../components/Button';
import IconButton from '../../components/IconButton';
import Question from '../../components/Question';
import RoomCode from '../../components/RoomCode';
import FilterBar from '../../components/FilterBar';
import useAuth from '../../hooks/useAuth';
import useRoom from '../../hooks/useRoom';
import useToast from '../../hooks/useToast';
import useModal from '../../hooks/useModal';
import DeleteIcon from '../../components/icons/DeleteIcon';
import AnswerIcon from '../../components/icons/AnswerIcon';
import CheckIcon from '../../components/icons/CheckIcon';
import { database } from '../../services/firebase';
import EmptyQuestionsImg from '../../assets/images/empty-questions.svg';
import DeleteQuestionModal from './DeleteQuestionModal';
import CloseRoomModal from './CloseRoomModal';

import '../../styles/room.scss';
import './styles.scss';

type RoomParams = {
  id: string;
}

export default function AdminRoom() {
  const { user } = useAuth();
  const history = useHistory();
  const { activeModal } = useModal();
  const { activeToast } = useToast();
  const params = useParams<RoomParams>();
  const roomId = params.id;

  const {
    title,
    questions,
    isClosed,
    filters,
    updateFilters,
    checkFilterStatus,
  } = useRoom(roomId);
  const hasQuestions = questions.length > 0;
  
  useEffect(() => {
    if (!user) return;
    (async () => {
      const roomRef = await database.ref(`rooms/${roomId}`).get();
      const authorId = roomRef.val()?.authorId;
      if (user?.id !== authorId) {
        if (isClosed) history.push('/');
        else history.push(`/rooms/${roomId}`);
      }
    })()
  }, [user, history, roomId, isClosed]);

  async function handleCloseRoom() {
    activeModal(<CloseRoomModal roomId={roomId} />)
  }

  async function handleOpenRoom() {
    await database.ref(`rooms/${roomId}/closedAt`).remove()
      .then(() => activeToast({
        type: 'success',
        message: 'A sala foi reaberta',
      }));
  }

  function handleCheckQuestionAsAnswered(questionId: string, isAnswered: boolean) {
    database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isAnswered: isAnswered ? false : true,
    });
  }

  function handleHighlightQuestion(questionId: string, isHighlighted = false) {
    database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isHighlighted: isHighlighted ? false : true,
    });
  }

  function handleDeleteQuestion(questionId: string) {
    activeModal(<DeleteQuestionModal roomId={roomId} questionId={questionId} />);
  }

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <Logo />
          <div>
            <RoomCode code={roomId} />
            <Button
              onClick={isClosed ? handleOpenRoom : handleCloseRoom}
              isOutlined
            >
              {isClosed ? 'Reabrir sala' : 'Fechar sala'}
            </Button>
          </div>
        </div>
      </header>
      <main>
        <div className="room-title">
          <h1>Sala {title}</h1>
          {hasQuestions && <span className="questions-counter">{questions.length} Pergunta(s)</span>}
          {isClosed && <span className="room-status">Sala fechada</span>}
        </div>
        <FilterBar filters={filters} updateFilters={updateFilters} />
        <section className="question-list">
          {!hasQuestions && (
            <div className="empty-questions">
              <img src={EmptyQuestionsImg} alt="Bolhas de chat" />
              <p>Nenhuma pergunta por aqui...</p>
              <span>Envie o código desta sala para seus amigos e</span>
              <span>comece a responder perguntas</span>
            </div>
          )}
          {questions.map((question) => (
              <Question
                key={question.id}
                content={question.content}
                author={question.author}
                isAnswered={question.isAnswered}
                isHighlighted={question.isHighlighted}
                className={checkFilterStatus(question)}
              >
                <p>Likes: {question.likeCount}</p>
                <IconButton
                  className="check-answered-button"
                  onClick={() => handleCheckQuestionAsAnswered(question.id, question.isAnswered)}
                  ariaLabel="Marcar como respondida"
                >
                  <CheckIcon />
                </IconButton>
                {!question.isAnswered && (
                  <IconButton
                    className="highlight-button"
                    onClick={() => handleHighlightQuestion(question.id, question.isHighlighted)}
                    ariaLabel="Destacar pergunta"
                  >
                    <AnswerIcon />
                  </IconButton>
                )}
                <IconButton
                  className="delete-button"
                  onClick={() => handleDeleteQuestion(question.id)}
                  ariaLabel="Deletar pergunta"
                >
                  <DeleteIcon />
                </IconButton>
              </Question>
          ))}
        </section>
      </main>
    </div>
  );
}
