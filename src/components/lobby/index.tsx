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
import Layout from '../atoms/layout';
import Input from '../atoms/input';

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
    <Layout>
      <h1 className="text-white text-xl">Lobby</h1>
      <form className="bg-neutral-800 px-6 py-2 rounded-md flex flex-col w-[25%]">
        <Input
          label={'Your Alias'}
          name="user-alias"
          id="user-alias"
          value={alias}
          onChange={(ev: ChangeEvent<HTMLInputElement>) =>
            setAlias(ev.target.value)
          }
        ></Input>

        <Input
          name={'room-id'}
          label={'Room ID'}
          id="room-id"
          value={roomNumber}
          onChange={(ev: ChangeEvent<HTMLInputElement>) =>
            setRoomNumber(ev.target.value)
          }
        ></Input>
        <Button type="submit" onClick={onSubmitHandler}>
          Join
        </Button>
      </form>
    </Layout>
  );
};

export default Lobby;
