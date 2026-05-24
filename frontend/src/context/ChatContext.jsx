import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client"

const backendURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3001";


const socket = io(backendURL,{
  autoConnect: true,
  transports: ["websocket"]
});

axios.defaults.baseURL = backendURL;
axios.defaults.withCredentials = true;

const ChatContext = createContext();

export const ChatContextProvider = ({ children }) => {
 const[currentUser,setCurrentUser] = useState(JSON.parse(localStorage.getItem("user")))
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [media, setMedia] = useState([]);

// get-allUser

 const getAllUser = async() =>{
    try {
        const user = await axios.get(`/api/user/alluser/${currentUser._id}`)
        
        setUsers(user.data)
    } catch (error) {
        console.log(error)
    }
 }
        


  // Fetch messages
  const fetchMessages = async (receiverId) => {
    if (!currentUser || !receiverId) return;

    try {
      const res = await axios.get(
        `/api/messages/${currentUser._id}/${receiverId}`
      );
      setMessages(res.data);
    } catch (error) {
      console.log(error);
    }
  };

    // Fetch media images
  const fetchMedia = async (receiverId) => {
    try {
      const res = await axios.get(
        `/api/messages/media/${currentUser._id}/${receiverId}`
      );
      console.log(res)
      setMedia(res.data);
    } catch (error) {
      console.log(error);
    }
  };

 const sendMessage = async (text, imageFile) => {
  if (!selectedUser) return;

  const formData = new FormData();

  formData.append("senderId", currentUser._id);
  formData.append("receiverId", selectedUser._id);
  formData.append("text", text);

  if (imageFile) {
    formData.append("image", imageFile);
  }

  try {
    const res = await axios.post(
      "/api/messages/send",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    setMessages((prev) => [...prev, res.data]);

    socket.emit("sendMessage", res.data);
  } catch (error) {
    console.log(error);
  }
};

  useEffect(() => {
    if (currentUser) {
      socket.emit("addUser", currentUser._id);
    }

    socket.on("getOnlineUsers", (users) => {
       
      setOnlineUsers(users);
    });

    socket.on("getMessage", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.off("getOnlineUsers");
      socket.off("getMessage");
    };
  }, [currentUser,socket]);

   return (
    <ChatContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        users,
        setUsers,
        selectedUser,
        setSelectedUser,
        messages,
        onlineUsers,
        media,
        fetchMessages,
        fetchMedia,
        sendMessage,
        getAllUser
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);
