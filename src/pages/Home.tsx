import { useHistory } from 'react-router-dom';
import illustrationImg from '../assets/images/illustration.svg';
import logoImg from '../assets/images/logo.svg';
import googleIcon from '../assets/images/google-icon.svg';

import '../styles/auth.scss';
import Button from '../components/Button';
import useAuth from '../hooks/useAuth';

export default function Home() {
  const { user, signInWithGoogle } = useAuth();
  const history = useHistory();

  async function handleCreateRoom() {
    if (!user) await signInWithGoogle();
    history.push('/rooms/new');
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
          <img src={logoImg} alt="Letmeask" />
          <button onClick={handleCreateRoom} className="create_room">
            <img src={googleIcon} alt="logo da Google" />
            Crie sua sala com o Google
          </button>
          <div className="separator">ou entre em um sala</div>
          <form>
            <input
              type="text"
              placeholder="Digite o código da sala"
            />
            <Button type="submit">
              Entrar na sala
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
}
