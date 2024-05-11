import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import ReactPlayer from 'react-player';
import { FaPhone } from 'react-icons/fa';

import { useSocket } from '../../context/socket';
import {
  NEW_USER_JOINED,
  CALL_USER,
  CALL_ACCEPTED,
  INCOMING_CALL,
  PEER_NEG_NEEDED,
  PEER_NEG_DONE,
} from '../../constants/socket';
import peer from '../../services/peer';
import Button from '../atoms/button';

const Room = () => {
  const { socket } = useSocket();
  // const { roomNumber, userAlias } = useParams();

  const [remoteConnData, setRemoteConnData] = useState<{
    socketId: string;
    userAlias: string;
  } | null>(null);
  const [myStream, setMyStream] = useState<any>(null);
  const [remoteStream, setRemoteStream] = useState<any>(null);

  const handleNewUserJoined = useCallback(({ remoteId, remoteAlias }: any) => {
    setRemoteConnData({ socketId: remoteId, userAlias: remoteAlias });
    console.log('CHECK1: USER JOINED', remoteId, remoteConnData);
  }, []);

  const generateOffer = async (_rId: string) => {
    const offer = await peer.makeOffer();
    console.log('C2: OFFER GENERATED');
    socket.emit(CALL_USER, { to: _rId, offer });
  };

  async function initRoom() {
    const _str = await navigator.mediaDevices.getUserMedia({
      // audio: true,
      video: true,
    });
    setMyStream(_str);
  }
  useEffect(() => {
    initRoom();
  }, []);

  const generateUserMedia: () => Promise<MediaStream> = async () => {
    return await navigator.mediaDevices.getUserMedia({ video: true });
  };

  const handleIncomingCall = async ({ offer, from }: any) => {
    const answer = await peer.makeAnswer(offer);
    console.log('C3: Incoming Call', { answer });
    socket.emit(CALL_ACCEPTED, { to: from, answer });
  };

  const handleCallAccepted = async ({ from, answer }: any) => {
    console.log('C4: Call accepted', from, answer);
    await peer.setLocalDescription(answer);
    const _str = await generateUserMedia();

    for (const track of _str.getTracks()) {
      peer.peer?.addTrack(track, _str);
    }
  };

  const handleNegotiationNeeded = useCallback(async () => {
    const offer = await peer.makeOffer();
    socket.emit(PEER_NEG_NEEDED, { to: remoteConnData?.socketId, offer });
  }, []);
  const handleIncomingNegotiation = useCallback(
    async ({ from, offer }: any) => {
      const ans = await peer.makeAnswer(offer);
      socket.emit(PEER_NEG_DONE, { to: from, offer: ans });
    },
    []
  );
  const handleNegotiationFinal = useCallback(async ({ offer }: any) => {
    await peer.setLocalDescription(offer);
  }, []);

  useEffect(() => {
    peer.peer?.addEventListener('negotiationneeded', handleNegotiationNeeded);
  }, [peer, handleNegotiationNeeded]);

  useEffect(() => {
    peer.peer?.addEventListener('track', (ev) => {
      const remoteStr = ev.streams;
      setRemoteStream(remoteStr[0]);
    });
  }, [remoteStream]);

  useEffect(() => {
    socket.on(NEW_USER_JOINED, handleNewUserJoined);
    socket.on(INCOMING_CALL, handleIncomingCall);
    socket.on(CALL_ACCEPTED, handleCallAccepted);
    socket.on(PEER_NEG_NEEDED, handleIncomingNegotiation);
    socket.on(PEER_NEG_DONE, handleNegotiationFinal);

    return () => {
      socket.off(NEW_USER_JOINED, handleNewUserJoined);
      socket.off(INCOMING_CALL, handleIncomingCall);
      socket.off(CALL_ACCEPTED, handleCallAccepted);
      socket.off(PEER_NEG_NEEDED, handleIncomingNegotiation);
      socket.off(PEER_NEG_DONE, handleNegotiationFinal);
    };
  }, []);

  return (
    <div className="w-full flex flex-col items-center justify-center">
      <h1>Room</h1>
      {remoteConnData?.socketId ? (
        <Button
          children={<FaPhone />}
          onClick={() => generateOffer(remoteConnData?.socketId)}
        ></Button>
      ) : null}
      <h2>
        {remoteConnData?.socketId
          ? `Connected To ${remoteConnData?.userAlias}`
          : `Room Empty`}
      </h2>
      <div className="w-full grid grid-cols-2 items-center justify-center">
        {myStream ? (
          <ReactPlayer
            autoPlay
            playing
            width={'400'}
            height={'245'}
            url={myStream}
          />
        ) : null}

        {remoteStream ? (
          <ReactPlayer
            autoPlay
            playing
            width={'400'}
            height={'245'}
            url={remoteStream}
          />
        ) : null}
      </div>
    </div>
  );
};

export default Room;
