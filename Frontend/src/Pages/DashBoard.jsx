import React, { useState, useEffect } from 'react';
import Popup from 'reactjs-popup';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useRoom } from '../Context/RoomContext';
import { toast } from 'react-hot-toast'

const DashBoard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null)
  const { roomSettings, setRoomSettings } = useRoom();
  const [isPrivate, setIsPrivate] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);

  // const publicRooms = Array.from({ length: 10 }, (_, i) => ({
  //   id: i + 1,
  //   name: `Room #${100 + Math.floor(Math.random() * 9000)}`,
  // }));

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRoomSettings((prev) => ({
      ...prev,
      [name]: name === 'time' || name === 'break' ? Number(value) : value,
    }));

    if (name === 'visibility') {
      setIsPrivate(value === 'private');
    }
  };

  const incrementTime = () => {
    setRoomSettings((prev) => {
      const newTime = Math.min(prev.time + 5, 120);
      const newBreak = newTime >= 60 ? 10 : 5;
      return { ...prev, time: newTime, break: newBreak };
    });
  };

  const decrementTime = () => {
    setRoomSettings((prev) => {
      const newTime = Math.max(prev.time - 5, 5);
      const newBreak = newTime >= 60 ? 10 : 5;
      return { ...prev, time: newTime, break: newBreak };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Room Settings:', roomSettings);
    localStorage.setItem('roomSettings', JSON.stringify(roomSettings));
    navigate('/room');
  };

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

  return (
    <div className="flex min-h-screen bg-gray-50 relative">
      <AnimatePresence>
        {showSidebar && (
          <motion.div
            initial={{ x: -250, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -250, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-64 bg-white border-r border-gray-200 p-4 flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-800">Public Rooms</h3>
                <button
                  onClick={() => setShowSidebar(false)}
                  className="text-gray-500 hover:text-gray-800 text-lg font-bold"
                  title="Hide"
                >
                  ×
                </button>
              </div>

              <ul className="space-y-3">
                {publicRooms.map((room) => (
                  <li key={room.id}>
                    <button
                      className="w-full text-left text-lg px-4 py-3 bg-blue-100 hover:bg-blue-200 rounded shadow transition"
                      onClick={() => alert(`Joining ${room.name}`)}
                    >
                      {room.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!showSidebar && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="absolute left-2 top-4 z-10"
        >
          <button
            onClick={() => setShowSidebar(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition"
          >
            Show Rooms
          </button>
        </motion.div>
      )}

      <div className="flex-1 p-6">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Welcome {user?.username || "User"}
        </h2>

        <div className="flex justify-center space-x-4">
          {/* Create Room */}
          <Popup
            trigger={
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.4 }}
                className="bg-blue-600 text-white px-6 py-2 rounded-md shadow hover:bg-blue-700 transition"
              >
                Create Room
              </motion.button>
            }
            modal
            nested
          >
            {(close) => (
              <AnimatePresence>
                <motion.div
                  key="modal"
                  initial={{ opacity: 0, y: -30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-lg p-6 shadow-xl w-96 mx-auto relative border border-gray-200"
                >
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    onClick={close}
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
                  >
                    &times;
                  </motion.button>

                  <h3 className="text-2xl font-semibold mb-6 text-center text-gray-800">
                    Room Settings
                  </h3>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Time */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Time (minutes)
                      </label>
                      <div className="flex items-center space-x-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          type="button"
                          onClick={decrementTime}
                          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                        >
                          –
                        </motion.button>
                        <input
                          type="number"
                          name="time"
                          value={roomSettings.time}
                          min="5"
                          max="120"
                          step="5"
                          onChange={handleInputChange}
                          className="w-full text-center border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          type="button"
                          onClick={incrementTime}
                          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                        >
                          +
                        </motion.button>
                      </div>
                    </div>

                    {/* Break Time */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Break Time (minutes)
                      </label>
                      <select
                        name="break"
                        value={roomSettings.break}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value={5}>5 minutes</option>
                        <option value={10}>10 minutes</option>
                        <option value={15}>15 minutes</option>
                        <option value={20}>20 minutes</option>
                      </select>
                    </div>

                    {/* Visibility */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Visibility
                      </label>
                      <select
                        name="visibility"
                        value={roomSettings.visibility}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="public">Public</option>
                        <option value="private">Private</option>
                      </select>
                    </div>

                    {/* Password */}
                    <AnimatePresence>
                      {isPrivate && (
                        <motion.div
                          key="password"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.25 }}
                        >
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Password
                          </label>
                          <input
                            type="password"
                            name="password"
                            value={roomSettings.password}
                            onChange={handleInputChange}
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="text-sm text-gray-500 text-center">
                      ⏱️ Session: {roomSettings.time} min | ☕ Break: {roomSettings.break} min
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      type="submit"
                      className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
                    >
                      Create Room
                    </motion.button>
                  </form>
                </motion.div>
              </AnimatePresence>
            )}
          </Popup>

          {/* Join Private Room */}
          <Popup
            trigger={
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.4 }}
                className="bg-blue-600 text-white px-6 py-2 rounded-md shadow hover:bg-blue-700 transition"
              >
                Join Private Room
              </motion.button>
            }
            modal
            nested
          >
            {(close) => (
              <motion.div
                key="joinRoomModal"
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-lg p-6 shadow-xl w-96 mx-auto relative border border-gray-200"
              >
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  onClick={close}
                  className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
                >
                  &times;
                </motion.button>

                <h3 className="text-2xl font-semibold mb-6 text-center text-gray-800">
                  Join Private Room
                </h3>

                <form onSubmit={(e) => { e.preventDefault(); alert('Joining Private Room...'); }} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Room ID
                    </label>
                    <input
                      type="text"
                      name="roomId"
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Password
                    </label>
                    <input
                      type="password"
                      name="password"
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    type="submit"
                    className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
                  >
                    Join Room
                  </motion.button>
                </form>
              </motion.div>
            )}
          </Popup>
        </div>
      </div>
    </div>
  );
};

export default DashBoard;
