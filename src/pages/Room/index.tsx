import { FormEvent, useState } from 'react';
import { useParams } from 'react-router-dom';
import Button from '../../components/Button';
import IconButton from '../../components/IconButton';
import Logo from '../../components/Logo';
import Question from '../../components/Question';
import RoomCode from '../../components/RoomCode';
import useAuth from '../../hooks/useAuth';
import useRoom from '../../hooks/useRoom';
import { database } from '../../services/firebase';
import LikeIcon from './LikeIcon';

import '../../styles/room.scss';

type RoomParams = {
  id: string;
}

export default function Room() {
  const { user } = useAuth();
  
  const [newQuestion, setNewQuestion] = useState('');
  const params = useParams<RoomParams>();
  const roomId = params.id;

  const { title, questions } = useRoom(roomId);

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
      isAnsweared: false,
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
          {questions.length > 0 && <span>{questions.length} Pergunta(s)</span>}
        </div>
        <form onSubmit={handleSendQuestion}>
          <textarea
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
              <span>Para enviar uma pergunta, <button>faça seu login</button>.</span>
            )}
            <Button type="submit" disabled={!user}>Enviar pergunta</Button>
          </div>
        </form>
        <section className="question-list">
          {questions.map((question) => (
            <Question
              key={question.id}
              content={question.content}
              author={question.author}
            >
              <IconButton
                className={question.likeId && 'liked'}
                onClick={() => handleLikeQuestion(question.id, question.likeId)}
                ariaLabel="Marcar como gostei"
              >
                {question.likeCount && <p>{question.likeCount}</p>}
                <LikeIcon />
              </IconButton>
            </Question>
          ))}
        </section>
      </main>
    </div>
  );
}
