import { useHistory } from 'react-router';
import Button from '../../../components/Button';
import Logo from '../../../components/Logo';
import AlertIcon from '../../../components/icons/AlertIcon';
import googleIcon from '../../../assets/images/google-icon.svg';
import useModal from '../../../hooks/useModal';
import useAuth from '../../../hooks/useAuth';

import './styles.scss';
import useToast from '../../../hooks/useToast';

export default function AdminLoginModal() {
  const history = useHistory();
  const { endModal } = useModal();
  const { signInWithGoogle } = useAuth();
  const { activeToast } = useToast();

  function handleBack() {
    history.push('/');
    endModal();
  }

  async function handleLogin() {
    await signInWithGoogle()
      .then(() => endModal())
      .catch(() => activeToast({
        message: 'Não foi possível realizar o login',
        type: 'error',
      }));
  }

  return (
    <div id="room-admin-login">
      <Logo />
      <AlertIcon />
      <p>Você deve estar logado</p>
      <p>Para acessar uma sala no modo admin</p>
      <div>
        <Button onClick={handleBack}>Voltar</Button>
        <button onClick={handleLogin} className="google-login">
          <img src={googleIcon} alt="logo da Google" />
          Logar com Google
        </button>
      </div>
    </div>
  );
}