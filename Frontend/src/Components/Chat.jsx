import React, { useState, useEffect, useRef } from 'react';
import { FaTimes, FaCommentAlt, FaPaperPlane, FaUser } from 'react-icons/fa';

// Sample users data
const users = [
  { id: 1, name: 'You', color: 'bg-indigo-500', textColor: 'text-white' },
  { id: 2, name: 'Me', color: 'bg-green-500', textColor: 'text-white' },
  { id: 3, name: 'Fong', color: 'bg-amber-500', textColor: 'text-white' },
  { id: 4, name: 'NotFong', color: 'bg-pink-500', textColor: 'text-white' },
];

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Function to get a random user (for demo purposes)
  const getRandomUser = () => {
    return users[Math.floor(Math.random() * (users.length - 1)) + 1]; // Exclude "You"
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() === '') return;
    
    const newMsg = {
      text: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      user: users[0], // Current user ("You")
    };
    
    setMessages([...messages, newMsg]);
    setNewMessage('');
    
    // Simulate group replies after random delays
    const replyCount = Math.floor(Math.random() * 2) + 1; // 1-2 replies
    for (let i = 0; i < replyCount; i++) {
      setTimeout(() => {
        const replyingUser = getRandomUser();
        setMessages(prev => [...prev, { 
          text: `${replyingUser.name === 'Alex' ? "I agree!" : "Interesting point!"}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          user: replyingUser
        }]);
      }, 1000 + (i * 1500));
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      sendMessage(e);
    }
  };

  return (
    <>
      {/* Floating chat button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed right-4 bottom-4 bg-indigo-600 text-white p-4 rounded-full shadow-lg hover:bg-indigo-700 transition-colors z-50 flex items-center"
          aria-label="Open group chat"
        >
          <FaCommentAlt size={20} className="mr-2" />
          <span>Group Chat</span>
        </button>
      )}

      {/* Chat window */}
      <div className={`fixed right-4 bottom-4 flex flex-col ${isOpen ? 'w-80 h-96' : 'w-0 h-0'} transition-all duration-300 ease-in-out overflow-hidden shadow-xl rounded-lg z-50 bg-white`}>
        {/* Chat Header */}
        <div className="bg-indigo-600 text-white p-3 rounded-t-lg flex justify-between items-center">
          <div className="flex items-center">
            <div className="relative">
              <div className="flex -space-x-2">
                {users.slice(0, 3).map(user => (
                  <div 
                    key={user.id} 
                    className={`w-8 h-8 rounded-full ${user.color} flex items-center justify-center text-xs ${user.textColor}`}
                  >
                    {user.name.charAt(0)}
                  </div>
                ))}
                {users.length > 3 && (
                  <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-xs text-gray-700">
                    +{users.length - 3}
                  </div>
                )}
              </div>
            </div>
            <h2 className="text-lg font-semibold ml-3">Group Chat</h2>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 rounded-full hover:bg-indigo-700 transition-colors"
            aria-label="Close chat"
          >
            <FaTimes />
          </button>
        </div>

        {/* Chat Body */}
        <div className="flex-1 bg-gray-50 p-3 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-500">
              <FaCommentAlt size={32} className="mb-2 text-gray-300" />
              <p>No messages yet</p>
              <p className="text-sm">Start the conversation!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {messages.map((message, index) => (
                <div 
                  key={index} 
                  className={`flex ${message.user.id === 1 ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-xs`}>
                    {message.user.id !== 1 && (
                      <div className="flex items-center mb-1">
                        <div className={`w-6 h-6 rounded-full ${message.user.color} flex items-center justify-center text-xs ${message.user.textColor} mr-2`}>
                          {message.user.name.charAt(0)}
                        </div>
                        <span className="text-xs font-medium text-gray-700">{message.user.name}</span>
                      </div>
                    )}
                    <div 
                      className={`p-3 rounded-lg ${message.user.id === 1 ? 'bg-indigo-500 text-white' : 'bg-white text-gray-800'} shadow`}
                    >
                      <p>{message.text}</p>
                      <p className={`text-xs mt-1 ${message.user.id === 1 ? 'text-indigo-200' : 'text-gray-500'}`}>
                        {message.timestamp}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Message Input */}
        <form onSubmit={sendMessage} className="bg-white border-t p-2">
          <div className="flex">
            <input
              type="text"
              className="flex-1 p-2 border rounded-l focus:outline-none focus:ring-1 focus:ring-indigo-500"
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              aria-label="Type your message"
            />
            <button
              type="submit"
              className="bg-indigo-600 text-white px-4 py-2 rounded-r hover:bg-indigo-700 transition-colors disabled:opacity-50"
              disabled={!newMessage.trim()}
            >
              <FaPaperPlane />
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default Chat;