import React, { useEffect } from 'react';
import { useChat } from '../context/ChatContext';

const Rightbar = () => {
  const { selectedUser, media, fetchMedia } = useChat();

  useEffect(() => {
    if (selectedUser) {
      fetchMedia(selectedUser._id);
    }
  }, [selectedUser]);
  
  if (!selectedUser) {
    return (
      <div className="w-full h-full border-l border-slate-200 bg-white flex items-center justify-center">
        <p className="text-slate-400 text-sm">No profile selected</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full border-l border-slate-200 bg-white flex flex-col overflow-y-auto">
      {/* User Profile Info */}
      <div className="p-6 flex flex-col items-center text-center border-b border-slate-100 shrink-0">
        <div className="relative mb-4">
          <img 
            src={selectedUser.image || 'https://via.placeholder.com/100'} 
            alt={selectedUser.name} 
            className="w-24 h-24 rounded-full object-cover border-4 border-slate-50 shadow-sm"
          />
        </div>
        <h3 className="text-lg font-bold text-slate-800 break-all">{selectedUser.name}</h3>
      </div>

      {/* Media Section */}
      <div className="p-4 flex-1">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-semibold text-slate-700">Shared Media</h4>
          <button className="text-xs text-blue-600 hover:underline font-medium">View All</button>
        </div>

        {/* Media Grid */}
        <div className="grid grid-cols-3 gap-2">
          {media?.length > 0 ? (
            media.map((item, index) => (
              <div 
                key={index} 
                className="aspect-square bg-slate-100 rounded-lg overflow-hidden group cursor-pointer relative"
              >
                <img 
                  src={item.image} 
                  alt="Shared media" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
            ))
          ) : (
            <div className="col-span-3 py-10 text-center">
              <p className="text-xs text-slate-400">No media shared yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Settings/Info Options */}
      <div className="p-4 space-y-2 border-t border-slate-100 mt-auto shrink-0">
        <button className="w-full text-left px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-md transition-colors flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          Privacy & Support
        </button>
        <button className="w-full text-left px-3 py-2 text-sm text-red-500 hover:bg-red-50 rounded-md transition-colors flex items-center gap-2 font-medium">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636" />
          </svg>
          Block User
        </button>
      </div>
    </div>
  );
};

export default Rightbar;