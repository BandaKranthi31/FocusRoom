
import React, { createContext, useContext, useState } from 'react';
import { roomSettings as initialRoomSettings } from '../Data/room'; 

const RoomContext = createContext();

export const useRoom = () => useContext(RoomContext);

export const RoomProvider = ({ children }) => {
  const [roomSettings, setRoomSettings] = useState(initialRoomSettings);

  return (
    <RoomContext.Provider value={{ roomSettings, setRoomSettings }}>
      {children}
    </RoomContext.Provider>
  );
};
