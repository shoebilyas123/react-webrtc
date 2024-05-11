import React, {
  ChangeEvent,
  FormEventHandler,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { useNavigate } from 'react-router-dom';

import { useSocket } from '../../context/socket';
import Button from '../atoms/button';
import { JOIN_ROOM } from '../../constants/socket';

const Lobby = () => {
  const [alias, setAlias] = useState<string>('');
  const [roomNumber, setRoomNumber] = useState<string>('');
  const navigate = useNavigate();
  const { socket } = useSocket();

  const onSubmitHandler: FormEventHandler = (ev) => {
    ev.preventDefault();
    socket.emit(JOIN_ROOM, { alias, roomNumber });
  };

  const handleRoomJoined = useCallback(
    ({ roomNumber, alias }: { roomNumber: string; alias: string }) => {
      navigate(`/room?roomNumber=${roomNumber}&alias=${alias}`);
    },
    [roomNumber, alias]
  );

  useEffect(() => {
    socket.on(JOIN_ROOM, handleRoomJoined);

    return () => {
      socket.off(JOIN_ROOM, handleRoomJoined);
    };
  }, [handleRoomJoined]);

  return (
    <div>
      <h1>Lobby</h1>
      <form className="flex flex-col w-[25%]">
        <label htmlFor="user-alias">Alias</label>
        <input
          id="user-alias"
          value={alias}
          className="outline"
          onChange={(ev: ChangeEvent<HTMLInputElement>) =>
            setAlias(ev.target.value)
          }
        ></input>

        <label htmlFor="room-id">Room No.</label>
        <input
          className="outline"
          id="room-id"
          value={roomNumber}
          onChange={(ev: ChangeEvent<HTMLInputElement>) =>
            setRoomNumber(ev.target.value)
          }
        ></input>
        <Button type="submit" onClick={onSubmitHandler}>
          Join
        </Button>
      </form>
    </div>
  );
};

export default Lobby;
