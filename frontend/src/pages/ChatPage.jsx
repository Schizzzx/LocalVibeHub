import React, { useEffect, useState } from 'react';
import axios from '../utils/axiosInstance';
import NavPanelLoggedIn from '../components/NavPanelLoggedIn';
import Footer from '../components/Footer';
import { motion, AnimatePresence } from 'framer-motion';

export default function ChatPage() {
  const [chatUsers, setChatUsers] = useState([]);         
  const [selectedUser, setSelectedUser] = useState(null); 
  const [messages, setMessages] = useState([]);           
  const [newMsg, setNewMsg] = useState('');               
  const currentUserId = parseInt(localStorage.getItem('userId')); 

  
  useEffect(() => {
    fetchChatUsers();
  }, []);

  
  const fetchChatUsers = async () => {
    try {
      const res = await axios.get('/api/chats/list');
      setChatUsers(res.data);
    } catch (err) {
      console.error('Error fetching chat list:', err);
    }
  };

  
  useEffect(() => {
    const targetId = localStorage.getItem('chatWith');
    if (targetId) {
      localStorage.removeItem('chatWith');
      fetchMessages(parseInt(targetId));
    }
  }, [chatUsers]);

  
  const fetchMessages = async (userId) => {
    try {
      setSelectedUser(userId);
      const res = await axios.get(`/api/chats/${userId}`);
      setMessages(res.data);
      fetchChatUsers(); 
    } catch (err) {
      console.error('Error fetching messages:', err);
    }
  };

  
  const sendMessage = async () => {
    if (!newMsg.trim()) return;
    try {
      await axios.post(`/api/chats/${selectedUser}`, { message: newMsg });
      setNewMsg('');
      fetchMessages(selectedUser); 
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  return (
    <div className="flex flex-col h-screen text-white">
      {}
      <NavPanelLoggedIn />

      {}
      <div className="flex flex-1 overflow-hidden">
        
        {}
        <motion.div
          className="w-1/3 bg-panel p-4 overflow-y-auto border-r border-gray-700"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-xl font-semibold mb-4">Chats</h2>
          {chatUsers.length === 0 ? (
            <p className="text-gray-400">No chats yet</p>
          ) : (
            chatUsers.map((user) => (
              <motion.div
                key={user.id}
                onClick={() => fetchMessages(user.id)}
                className={`cursor-pointer p-2 rounded-lg mb-2 hover:bg-gray-700 ${
                  selectedUser === user.id ? 'bg-gray-700' : ''
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex justify-between items-center">
                  <span>{user.username}</span>
                  {user.unread_count > 0 && (
                    <span className="bg-red-600 text-white text-xs px-2 py-0.5 rounded-full ml-2">
                      {user.unread_count}
                    </span>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </motion.div>

        {}
        <motion.div
          className="w-2/3 flex flex-col bg-panel p-4"
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {selectedUser ? (
            <>
              {}
              <div className="flex-1 overflow-y-auto mb-4 pr-2">
                <AnimatePresence initial={false}>
                  {messages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      className={`mb-2 max-w-[70%] ${
                        msg.sender_id === currentUserId
                          ? 'ml-auto text-right'
                          : 'text-left'
                      }`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div
                        className={`inline-block px-4 py-2 rounded-xl ${
                          msg.sender_id === currentUserId
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-600 text-white'
                        }`}
                      >
                        {msg.message}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        {new Date(msg.created_at).toLocaleString()}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {}
              <motion.div
                className="flex"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <input
                  type="text"
                  value={newMsg}
                  onChange={(e) => setNewMsg(e.target.value)}
                  className="flex-1 bg-gray-800 border border-gray-600 text-white rounded-l-xl px-4 py-2 focus:outline-none"
                  placeholder="Type a message..."
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                />
                <button
                  onClick={sendMessage}
                  className="bg-blue-600 text-white px-4 py-2 rounded-r-xl hover:bg-blue-500"
                >
                  Send
                </button>
              </motion.div>
            </>
          ) : (
            <div className="text-gray-500 m-auto text-xl">
              Select a chat to start messaging
            </div>
          )}
        </motion.div>
      </div>

      {}
      <Footer />
    </div>
  );
}
