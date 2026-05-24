import React, { useEffect } from 'react';
import { useChat } from '../context/ChatContext';
import { useAuth } from '../context/AuthContext';

const Leftbar = () => {
  // Destructuring users and onlineUser (usually an array of IDs from Socket.io)
  const { users, getAllUser, setSelectedUser, onlineUsers } = useChat();
 const { logOut } = useAuth()
  useEffect(() => {
    getAllUser();
  }, [getAllUser]);

  // 1. Handle the loading state so it doesn't try to map undefined
  if (!users) {
    return (
      <div className="w-64 h-screen bg-slate-900 text-white flex items-center justify-center border-r border-slate-700">
        <p className="text-slate-400 animate-pulse">Loading chats...</p>
      </div>
    );
  }

  return (
    <div className="w-64 h-screen bg-slate-900 text-white flex flex-col border-r border-slate-700">
      <div className="flex p-4 border-b border-slate-700 justify-between items-center">
        <h2 className="text-xl font-bold">Messages</h2>
        <h3 onClick={logOut}  className='font-bold border-slate-700 pl-1.5 pr-1.5 bg-red-600 rounded-xl cursor-pointer hover:scale-[1.02]'>logout</h3>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* 2. Optional chaining (?) ensures it doesn't crash if users is temporarily null */}
        {users?.map((user) => {
          // 3. Logic to check if THIS specific user is in the onlineUser array
          const isUserOnline = onlineUsers?.includes(user._id);
         
          return (
            <div
              onClick={() => setSelectedUser(user)}
              key={user._id}
              className="flex items-center p-4 hover:bg-slate-800 cursor-pointer transition-colors border-b border-slate-800/50"
            >
              {/* Avatar Container */}
              <div className="relative">
                <img
                  src={user.image || 'https://via.placeholder.com/40'}
                  alt={user.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                
                {/* Online Status Indicator */}
                <span
                  className={`absolute bottom-0 right-0 w-3 h-3 border-2 border-slate-900 rounded-full ${
                    isUserOnline ? 'bg-green-500' : 'bg-slate-500'
                  }`}
                ></span>
              </div>

              {/* User Info */}
              <div className="ml-3 overflow-hidden">
                <p className="text-sm font-medium truncate">{user.name}</p>
                <p className="text-xs text-slate-400 truncate">
                  {isUserOnline ? 'Online' : 'Offline'}
                </p>
              </div>
            </div>
          );
        })}

        {/* 4. Show a message if no users are found */}
        {users.length === 0 && (
          <div className="p-4 text-center text-slate-500 text-sm">
            No users found
          </div>
        )}
      </div>
    </div>
  );
};

export default Leftbar;