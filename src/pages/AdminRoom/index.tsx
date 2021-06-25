import { useHistory } from 'react-router';
import { useParams } from 'react-router-dom';
import Logo from '../../components/Logo';
import Button from '../../components/Button';
import IconButton from '../../components/IconButton';
import Question from '../../components/Question';
import RoomCode from '../../components/RoomCode';
import useRoom from '../../hooks/useRoom';
import DeleteIcon from '../../components/icons/DeleteIcon';
import AnswerIcon from '../../components/icons/AnswerIcon';
import CheckIcon from '../../components/icons/CheckIcon';
import { database, firebase } from '../../services/firebase';

import '../../styles/room.scss';
import './styles.scss';

type RoomParams = {
  id: string;
}

export default function Room() {
  const history = useHistory();
  const params = useParams<RoomParams>();
  const roomId = params.id;

  const { title, questions } = useRoom(roomId);
  
  async function handleCloseRoom() {
    await database.ref(`rooms/${roomId}`).update({
      closedAt: firebase.database.ServerValue.TIMESTAMP,
    }).then(() => {
      history.push('/');
    });
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
            <Button onClick={handleCloseRoom} isOutlined>Encerrar sala</Button>
          </div>
        </div>
      </header>
      <main>
        <div className="room-title">
          <h1>Sala {title}</h1>
          {questions.length > 0 && <span>{questions.length} Pergunta(s)</span>}
        </div>
        <section className="question-list">
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
