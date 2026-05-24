import React from 'react'
import Chatpage from './pages/Chatpage'
import { Routes,Route,Navigate } from 'react-router-dom'
import Loginpage from './pages/Loginpage'
import Register from './components/Register'
import { useAuth } from './context/AuthContext'

const App = () => {

  const {authUser} = useAuth()
  return (
 <Routes>
    
      <Route 
        path='/' 
        element={authUser ? <Navigate to="/chat" /> : <Loginpage />}
      />
     
      <Route 
        path='/register' 
        element={authUser ? <Navigate to="/chat" /> : <Register />}
      />
      
      <Route 
        path='/chat' 
        element={authUser ? <Chatpage /> : <Navigate to="/" />}
      />
    </Routes>

  )
}

export default App