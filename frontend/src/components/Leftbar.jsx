import React, { useEffect } from 'react';
import { useChat } from '../context/ChatContext';
import { useAuth } from '../context/AuthContext';

const Leftbar = () => {
  const { users, getAllUser, setSelectedUser, onlineUsers } = useChat();
  const { logOut } = useAuth();

  useEffect(() => {
    getAllUser();
  }, [getAllUser]);

  if (!users) {
    return (
      <div className="w-full h-full bg-slate-900 text-white flex items-center justify-center border-r border-slate-700">
        <p className="text-slate-400 animate-pulse">Loading chats...</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-slate-900 text-white flex flex-col border-r border-slate-700">
      <div className="flex p-4 border-b border-slate-700 justify-between items-center">
        <h2 className="text-xl font-bold">Messages</h2>
        <button 
          onClick={logOut}  
          className='font-bold border-none px-3 py-1 bg-red-600 rounded-xl cursor-pointer hover:scale-[1.02] transition-transform text-sm'
        >
          Logout
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {users?.map((user) => {
          const isUserOnline = onlineUsers?.includes(user._id);
         
          return (
            <div
              onClick={() => setSelectedUser(user)}
              key={user._id}
              className="flex items-center p-4 hover:bg-slate-800 cursor-pointer transition-colors border-b border-slate-800/50"
            >
              <div className="relative shrink-0">
                <img
                  src={user.image || 'https://via.placeholder.com/40'}
                  alt={user.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <span
                  className={`absolute bottom-0 right-0 w-3 h-3 border-2 border-slate-900 rounded-full ${
                    isUserOnline ? 'bg-green-500' : 'bg-slate-500'
                  }`}
                ></span>
              </div>

              <div className="ml-3 overflow-hidden min-w-0 flex-1">
                <p className="text-sm font-medium truncate">{user.name}</p>
                <p className="text-xs text-slate-400 truncate">
                  {isUserOnline ? 'Online' : 'Offline'}
                </p>
              </div>
            </div>
          );
        })}

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