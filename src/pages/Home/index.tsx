import { FormEvent, useState } from 'react';
import { useHistory } from 'react-router-dom';
import googleIcon from '../../assets/images/google-icon.svg';
import illustrationImg from '../../assets/images/illustration.svg';
import Logo from '../../components/Logo';
import Button from '../../components/Button';
import useAuth from '../../hooks/useAuth';
import { database } from '../../services/firebase';
import LogInIcon from '../../components/icons/LogInIcon';
import TextBox from '../../components/TextBox';
import useToast from '../../hooks/useToast';

import '../../styles/auth.scss';

export default function Home() {
  const { user, signInWithGoogle } = useAuth();
  const history = useHistory();
  const { activeToast } = useToast();

  const [roomCode, setRoomCode] = useState('');

  async function handleCreateRoom() {
    if (!user) await signInWithGoogle();
    history.push('/rooms/new');
  }

  async function handleJoinRoom(event: FormEvent) {
    event.preventDefault();
    if (roomCode.trim() === '') return;

    const roomRef = await database.ref(`rooms/${roomCode}`).get();
    if (!roomRef.exists()) return activeToast({
      type: 'error',
      message: 'A sala não existe.'
    });

    const { authorId, closedAt } = roomRef.val();
    if (closedAt && authorId !== user?.id) return activeToast({
      type: 'error',
      message: 'A sala foi encerrada.'
    });

    if (authorId === user?.id) history.push(`rooms/admin/${roomCode}`)
    else history.push(`rooms/${roomCode}`);
  }

  return (
    <div id="page_auth">
      <aside>
        <img src={illustrationImg} alt="Ilustração simbolizando perguntas e repostas" />
        <strong>Cria salas de Q&amp;A ao-vivo</strong>
        <p>Tire as dúvidas da sua audiência em tempo-real</p>
      </aside>
      <main>
        <div className="main_content">
          <Logo />
          <button onClick={handleCreateRoom} className="create_room">
            <img src={googleIcon} alt="logo da Google" />
            Crie sua sala com o Google
          </button>
          <div className="separator">ou entre em um sala</div>
          <form onSubmit={handleJoinRoom}>
            <TextBox
              variant="input"
              type="text"
              placeholder="Digite o código da sala"
              onChange={(event) => setRoomCode(event.target.value)}
              value={roomCode}
            />
            <Button type="submit">
              <LogInIcon />
              Entrar na sala
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
}
