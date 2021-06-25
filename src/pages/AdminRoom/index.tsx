import { useHistory, useParams } from 'react-router-dom';
import Logo from '../../components/Logo';
import Button from '../../components/Button';
import IconButton from '../../components/IconButton';
import Question from '../../components/Question';
import RoomCode from '../../components/RoomCode';
import useAuth from '../../hooks/useAuth';
import useRoom from '../../hooks/useRoom';
import DeleteIcon from '../../components/icons/DeleteIcon';
import AnswerIcon from '../../components/icons/AnswerIcon';
import CheckIcon from '../../components/icons/CheckIcon';
import { database, firebase } from '../../services/firebase';
import EmptyQuestionsImg from '../../assets/images/empty-questions.svg';

import '../../styles/room.scss';
import './styles.scss';
import { useEffect } from 'react';

type RoomParams = {
  id: string;
}

export default function Room() {
  const { user } = useAuth();
  const history = useHistory();
  const params = useParams<RoomParams>();
  const roomId = params.id;

  const { title, questions, isClosed } = useRoom(roomId);
  const hasQuestions = questions.length > 0;
  
  useEffect(() => {
    if (!user) return;
    (async () => {
      const roomRef = await database.ref(`rooms/${roomId}`).get();
      const authorId = roomRef.val()?.authorId;
      if (user?.id !== authorId) {
        if (user?.id !== authorId) history.push('/');
        else history.push(`/rooms/${roomId}`);
      }
    })()
  }, [user, history, roomId, isClosed])

  async function handleCloseRoom() {
    await database.ref(`rooms/${roomId}`).update({
      closedAt: firebase.database.ServerValue.TIMESTAMP,
    })
  }

  async function handleOpenRoom() {
    await database.ref(`rooms/${roomId}/closedAt`).remove();
  }

  function handleCheckQuestionAsAnswered(questionId: string) {
    if (window.confirm('Tem certeza que você deseja marcar como respondida?')) {
      database.ref(`rooms/${roomId}/questions/${questionId}`).update({
        isAnswered: true,
      });
    }
  }

  function handleHighlightQuestion(questionId: string, isHighlighted = false) {
    database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isHighlighted: isHighlighted ? false : true,
    });
  }

  function handleDeleteQuestion(questionId: string) {
    if (window.confirm('Tem certeza que você deseja excluir esta pergunta?')) {
      database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
    }
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
            >
              <p>Likes: {question.likeCount}</p>
              {!question.isAnswered && (
                <>
                  <IconButton
                    className="check-answered-button"
                    onClick={() => handleCheckQuestionAsAnswered(question.id)}
                    ariaLabel="Marcar como respondida"
                  >
                    <CheckIcon />
                  </IconButton>
                  <IconButton
                    className="highlight-button"
                    onClick={() => handleHighlightQuestion(question.id, question.isHighlighted)}
                    ariaLabel="Destacar pergunta"
                  >
                    <AnswerIcon />
                  </IconButton>
                </>
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
