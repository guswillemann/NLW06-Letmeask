import { FormEvent, useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import Button from '../../components/Button';
import IconButton from '../../components/IconButton';
import Logo from '../../components/Logo';
import Question from '../../components/Question';
import RoomCode from '../../components/RoomCode';
import useAuth from '../../hooks/useAuth';
import useRoom from '../../hooks/useRoom';
import useToast from '../../hooks/useToast';
import { database } from '../../services/firebase';
import LikeIcon from '../../components/icons/LikeIcon';
import EmptyQuestionsImg from '../../assets/images/empty-questions.svg';
import TextBox from '../../components/TextBox';
import FilterBar from '../../components/FilterBar';

import '../../styles/room.scss';

type RoomParams = {
  id: string;
}

export default function Room() {
  const { user, signInWithGoogle } = useAuth();
  const history = useHistory();
  const { activeToast } = useToast();

  const [newQuestion, setNewQuestion] = useState('');
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
    if (!isClosed) return;
    history.push('/');
    activeToast({
      type: 'alert',
      message: 'A sala foi fechada',
    })
  }, [isClosed, history, activeToast])

  async function handleSendQuestion(event: FormEvent) {
    event.preventDefault();
    if (newQuestion.trim() === '') return;
    if (!user) throw new Error('You must be logged in');
    
    const question = {
      content: newQuestion,
      author: {
        name: user.name,
        avatar: user.avatar,
      },
      isHighlighted: false,
      isAnswered: false,
    };

    await database.ref(`rooms/${roomId}/questions`).push(question);
    setNewQuestion('');
  }

  async function handleLikeQuestion(questionId: string, likeId: string | undefined) {
    if (likeId) database.ref(`rooms/${roomId}/questions/${questionId}/likes/${likeId}`).remove()
    
    else database.ref(`rooms/${roomId}/questions/${questionId}/likes`).push({
      authorId: user?.id,
    })
  }

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <Logo />
          <RoomCode code={roomId} />
        </div>
      </header>
      <main>
        <div className="room-title">
          <h1>Sala {title}</h1>
          {hasQuestions && <span className="questions-counter">{questions.length} Pergunta(s)</span>}
        </div>
        <form onSubmit={handleSendQuestion}>
          <TextBox
            variant="textarea"
            placeholder="O que você quer perguntar?"
            onChange={(event) => setNewQuestion(event.target.value)}
            value={newQuestion}
          />
          <div className="form-footer">
            { user
            ? (
              <div className="user-info">
                <img src={user.avatar} alt={user.name} />
                <span>{user.name}</span>
              </div>
            )
            : (
              <span>Para enviar uma pergunta, <button onClick={signInWithGoogle}>faça seu login</button>.</span>
            )}
            <Button type="submit" disabled={!user}>Enviar pergunta</Button>
          </div>
        </form>
        <FilterBar filters={filters} updateFilters={updateFilters} />
        <section className="question-list">
          {!hasQuestions && (
            <div className="empty-questions">
              <img src={EmptyQuestionsImg} alt="Bolhas de chat" />
              <p>Nenhuma pergunta por aqui...</p>
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
              {!question.isAnswered && (
                <IconButton
                  className={question.likeId && 'liked'}
                  onClick={() => handleLikeQuestion(question.id, question.likeId)}
                  ariaLabel="Marcar como gostei"
                  title={question.likeId ? 'Remover like' : 'Adicionar like'}
                >
                  {question.likeCount && <p>{question.likeCount}</p>}
                  <LikeIcon />
                </IconButton>
              )}
            </Question>
          ))}
        </section>
      </main>
    </div>
  );
}
