import React,{useEffect} from 'react'
import Leftbar from '../components/Leftbar'
import Middlebar from '../components/Middlebar'
import Rightbar from '../components/Rightbar'



const Chatpage = () => {

  return (
      <div className="flex h-screen w-full overflow-hidden">
      <Leftbar/>
      <Middlebar/>
      <Rightbar/>
    </div>
  )
}

export default Chatpage