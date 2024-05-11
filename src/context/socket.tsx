import React, {
  FC,
  PropsWithChildren,
  createContext,
  useContext,
  useMemo,
} from 'react';
import { Socket, io } from 'socket.io-client';

export interface SocketContextCtx {
  socket: Socket;
}

export const SocketContext = createContext<SocketContextCtx>(
  {} as SocketContextCtx
);

export const useSocket = () => useContext(SocketContext);

export const SocketProvider: FC<PropsWithChildren> = (props) => {
  // Connecting to the remote signalling server hosted on AWS EC2 instance
  const socket = useMemo(() => io('http://13.232.167.76'), []);

  return (
    <SocketContext.Provider value={{ socket }}>
      {props.children}
    </SocketContext.Provider>
  );
};
