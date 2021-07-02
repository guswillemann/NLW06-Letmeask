import Logo from "../Logo";

import './styles.scss';

export default function LoadingScreen() {
  return (
    <div id="loading-screen">
      <Logo />
      <span>Carregando</span>
    </div>
  );
}
