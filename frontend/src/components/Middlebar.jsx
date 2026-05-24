import React, { useState, useEffect, useRef } from 'react';
import { useChat } from '../context/ChatContext';

const Middlebar = () => {
  const [text, setText] = useState("");
  const [image, setImage] = useState("");
  const scrollRef = useRef();
  const { selectedUser, messages, currentUser, setSelectedUser, sendMessage, fetchMedia, fetchMessages, onlineUsers } = useChat();

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (selectedUser) {
      fetchMessages(selectedUser._id);
      fetchMedia(selectedUser._id);
    }
  }, [selectedUser]);

  const formatTime = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim() && !image) return;
    await sendMessage(text, image);
    setText("");
    setImage("");
  };

  if (!selectedUser) {
    return (
      <div className="flex-1 hidden md:flex flex-col items-center justify-center bg-slate-50 h-full">
        <p className="text-slate-500">Select a user to start chatting</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-white min-w-0">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 flex items-center bg-white sticky top-0 z-10 justify-between">
        <div className="flex items-center min-w-0">
          {/* Back button visible only on mobile */}
          <button 
            onClick={() => setSelectedUser(null)} 
            className="mr-3 p-1 rounded-full hover:bg-slate-100 md:hidden text-slate-600"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          
          <img 
            src={selectedUser.image || 'https://via.placeholder.com/40'} 
            className="w-10 h-10 rounded-full shrink-0 object-cover" 
            alt="" 
          />
          <div className="ml-3 overflow-hidden">
            <h3 className="font-bold text-slate-800 truncate">{selectedUser.name}</h3>
            {onlineUsers?.includes(selectedUser?._id) ? (
              <p className="text-xs text-green-500">Active now</p>
            ) : (
              <p className="text-xs text-slate-400">Offline</p>
            )}
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.senderId === currentUser._id ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] md:max-w-[70%] px-4 py-2 rounded-2xl shadow-sm ${
                msg.senderId === currentUser._id
                  ? "bg-blue-600 text-white rounded-br-none"
                  : "bg-white text-slate-800 border border-slate-200 rounded-bl-none"
              }`}
            >
              {msg.text && <p className="text-sm wrap-break-word">{msg.text}</p>}

              {msg.image && (
                <div className="mt-3 relative group max-w-full sm:max-w-xs">
                  <img
                    src={msg.image}
                    alt="chat"
                    className="w-full max-h-60 md:max-h-72 object-cover rounded-2xl border border-slate-200 shadow-md cursor-pointer transition-transform duration-300 sm:group-hover:scale-[1.02]"
                  />
                  <div className="absolute inset-0 rounded-2xl bg-black/0 sm:group-hover:bg-black/10 transition-all duration-300"></div>
                  <a
                    href={msg.image}
                    target="_blank"
                    rel="noreferrer"
                    className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12H9m12 0A9 9 0 1112 3a9 9 0 019 9zm-9 4v-8" />
                    </svg>
                  </a>
                </div>
              )}

              <span className={`text-[10px] block mt-1 ${msg.senderId === currentUser._id ? "text-blue-100" : "text-slate-400"}`}>
                {formatTime(msg.createdAt)}
              </span>
            </div>
          </div>
        ))}
        <div ref={scrollRef} />
      </div>

      {/* Input Area */}
      <div className="p-3 md:p-4 bg-white border-t border-slate-200">
        <form onSubmit={handleSend} className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-0"
          />

          <label className="border p-2 rounded-lg cursor-pointer bg-slate-50 hover:bg-slate-100 shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <input
              type="file"
              accept="image/*"
              onChange={handleImage}
              className="hidden"
            />
          </label>

          <button 
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors shrink-0"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
          </button>
        </form>
        {image && <p className="text-xs text-blue-500 mt-1 truncate">Image selected: {image.name}</p>}
      </div>
    </div>
  );
};

export default Middlebar;