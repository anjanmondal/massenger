import React,{useEffect} from 'react'
import Leftbar from '../components/Leftbar'
import Middlebar from '../components/Middlebar'
import Rightbar from '../components/Rightbar'
import { useChat } from '../context/ChatContext'



const Chatpage = () => {
 
  const { selectedUser } = useChat()
  return (
      <div className="flex h-screen w-screen overflow-hidden bg-slate-50">
      {/* Leftbar: Hidden on mobile if a chat is active */}
      <div className={`${selectedUser ? 'hidden md:flex' : 'flex'} w-full md:w-64 lg:w-72 shrink-0`}>
        <Leftbar />
      </div>

      {/* Middlebar: Occupies full width on mobile if active, fills remainder on desktop */}
      <div className={`${!selectedUser ? 'hidden md:flex' : 'flex'} flex-1 h-full`}>
        <Middlebar />
      </div>

      {/* Rightbar: Stays tucked away until large screens hit */}
      <div className="hidden lg:flex w-80 shrink-0">
        <Rightbar />
      </div>
    </div>
  )
}

export default Chatpage