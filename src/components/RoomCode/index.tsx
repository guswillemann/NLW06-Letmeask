import copyImg from '../../assets/images/copy.svg';

import './styles.scss';

type RoomCodeProps = {
  code: string;
}

export default function RoomCode({ code }: RoomCodeProps) {
  function copyRoomCodeToClipBoard() {
    navigator.clipboard.writeText(code);
  }

  return (
    <button className="room-code" onClick={copyRoomCodeToClipBoard}>
      <div>
        <img src={copyImg} alt="Copiar código da sala" />
      </div>
      <span>Sala {code}</span>
    </button>
  );
}
