import { FormEvent, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import illustrationImg from '../../assets/images/illustration.svg';
import Logo from '../../components/Logo';
import Button from '../../components/Button';
import useAuth from '../../hooks/useAuth';
import { database } from '../../services/firebase';
import TextBox from '../../components/TextBox';

import '../../styles/auth.scss';

export default function NewRoom() {
  const { user } = useAuth();
  const history = useHistory();
  const [roomName, setRoomName] = useState('');

  async function handleCreateRoom(event: FormEvent) {
    event.preventDefault();
    if (roomName.trim() === '') return;

    const roomRef = database.ref('rooms');
    const firebaseRoom = await roomRef.push({
      title: roomName,
      authorId: user?.id,
    });
    history.push(`/rooms/admin/${firebaseRoom.key}`)
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
          <h2>Crie uma nova sala</h2>
          <form onSubmit={handleCreateRoom}>
            <TextBox
              variant="input"
              type="text"
              placeholder="Nome da sala"
              onChange={(event) => setRoomName(event.target.value)}
              value={roomName}
            />
            <Button type="submit">
              Criar sala
            </Button>
          </form>
          <p>Quer entrar numa sala existente? <Link to="/">Clique aqui.</Link></p>
        </div>
      </main>
    </div>
  );
}
