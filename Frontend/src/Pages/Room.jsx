import React, { useEffect, useState, useRef } from 'react';
import { useRoom } from '../Context/RoomContext';
import Popup from 'reactjs-popup';
import { FaTimes } from 'react-icons/fa';
import Chat from '../Components/Chat';
import Notes from '../Components/Notes';

const Room = () => {
  const [user, setUser] = useState(null)
  const { roomSettings } = useRoom();
  const [workTimeLeft, setWorkTimeLeft] = useState(roomSettings.time * 60);
  const [breakTimeLeft, setBreakTimeLeft] = useState(roomSettings.break * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const intervalRef = useRef(null);

  const randomNames = ['Fong', 'notFong', 'MaybeFong', 'IamFony', 'whyFong'];
  const [peopleInRoom, setPeopleInRoom] = useState(randomNames);
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/auth/current-user", {
          headers: {
            "Content-Type": "application/json",
          },
          method: "GET",
          credentials: "include",
        });
        const data = await response.json();
        if (data.success) {
          setUser(data.user);
          // console.log(data.user)
        } else {
          navigate("/login")
          toast.error(data.message || "Something went wrong")
        }
      } catch (error) {
        console.error("Error fetching current user", error)
        toast.error("Something went wrong")
        navigate("/login")
      }
    }
    fetchCurrentUser();
  }, [navigate])

  const formatTime = (seconds) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, '0');
    const s = String(seconds % 60).padStart(2, '0');
    return `${m}:${s}`;
  };

  const startTimer = () => {
    if (intervalRef.current) return;
    setIsRunning(true);
    intervalRef.current = setInterval(() => {
      if (isBreak) {
        setBreakTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
            setIsBreak(false);
            setWorkTimeLeft(roomSettings.time * 60);
            setIsRunning(false);
            return roomSettings.break * 60;
          }
          return prev - 1;
        });
      } else {
        setWorkTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
            setIsBreak(true);
            setBreakTimeLeft(roomSettings.break * 60);
            setIsRunning(false);
            return roomSettings.time * 60;
          }
          return prev - 1;
        });
      }
    }, 1000);
  };

  const pauseTimer = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
    setIsRunning(false);
  };

  const resetTimer = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
    setIsRunning(false);
    setIsBreak(false);
    setWorkTimeLeft(roomSettings.time * 60);
    setBreakTimeLeft(roomSettings.break * 60);
  };

  useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);

  return (
    <div className="relative min-h-screen font-Time bg-blue-50 overflow-hidden">
      <div className="flex flex-col items-center justify-center py-16">
        <h1 className="text-3xl font-bold mb-4">
          {isBreak ? 'Break Time ☕' : 'Work Time ⏱️'}
        </h1>

        <div className="text-6xl mb-6">
          {isBreak ? formatTime(breakTimeLeft) : formatTime(workTimeLeft)}
        </div>

        <div className="space-x-4 mb-6">
          {!isRunning ? (
            <button
              onClick={startTimer}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded"
            >
              Start
            </button>
          ) : (
            <button
              onClick={pauseTimer}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded"
            >
              Pause
            </button>
          )}
          <button
            onClick={resetTimer}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded"
          >
            Reset
          </button>
        </div>

        <Popup
          trigger={
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded mt-6">
              Show People
            </button>
          }
          modal
          closeOnDocumentClick
        >
          {(close) => (
            <div className="p-6 bg-white rounded-lg w-80 relative">
              <h2 className="text-2xl font-semibold mb-4">People in Room</h2>
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                onClick={close}
              >
                <FaTimes size={20} />
              </button>
              <ul className="space-y-2">
                {peopleInRoom.map((name, index) => (
                  <li key={index} className="text-lg">
                    {name}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Popup>
      </div>

      <div className="absolute top-4 left-4 z-10">
        <Notes />
      </div>
      <div className="absolute top-4 right-4 z-10">
        <Chat />
      </div>
    </div>
  );
};

export default Room;
