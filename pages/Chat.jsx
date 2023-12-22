import React , {useEffect, useState , useRef} from 'react'
import styled from 'styled-components';
import { useNavigate} from "react-router-dom"
import { allUsersRoute , host } from '../utils/APIRoutes';
import axios from "axios";
import Contacts from '../component/Contacts';
import Welcome from '../component/Welcome';
import ChatContainer from '../component/ChatContainer';
import { io} from 'socket.io-client';
function Chat() {
  const socket =  useRef();
  const [contacts , setContacts] = useState([]);
  const [currentUser , setCurrentUser] = useState(undefined);
  const [currentChat , setCurrentChat] = useState(undefined);
  const [isLoaded , setIsLoaded] = useState(false);
  const navigate = useNavigate();

  // useEffect(() =>{

  //   const fetchdata = async()=>{
  //     if(!localStorage.getItem("chat-app-user")){
  //       navigate("/login");
  //      }
  //      else{
  //       setCurrentUser(await JSON.parse(localStorage.getItem("chat-app-user")))
  //      }
  //   }
  //   fetchdata();
  // },[]);


  useEffect(() => {
    const fetchdata = async () => {
      if (!localStorage.getItem("chat-app-user")) {
        console.log("User data not found in localStorage");
        navigate("/login");
      } else {
        const userJson = localStorage.getItem("chat-app-user");
        if (userJson) {
          try {
            const user = JSON.parse(userJson);
            setCurrentUser(user);
            setIsLoaded(true);
          } catch (error) {
            console.error("Error parsing user data from localStorage:", error);
          }
        }
      }
    }
    fetchdata();
  }, []);
  
  useEffect(()=>{

     
   
      if(currentUser){
        socket.current=io(host);
        socket.current.on("connect", () => {
          console.log("Socket connected");
        });
  
        socket.current.on("disconnect", () => {
          console.log("Socket disconnected");
        });
        socket.current.emit("add-user" , currentUser._id);
      }
    
  },[currentUser]);


  useEffect(() =>{

    const fetchdata = async()=>{
     if(currentUser){
      if(currentUser.isAvatarImageSet){
    const data = await axios.get(`${allUsersRoute}/${currentUser._id}`);
    setContacts(data.data);
      }
      else{
        navigate("/setAvatar");
      }
     }
    }
    fetchdata();
  },[currentUser]);

  const handleChatChange = (chat) =>{
      setCurrentChat(chat);
  }

  return (
   
   <Container>
     <div className="container">
     <Contacts 
     contacts = {contacts} 
     currentUser = {currentUser}
      changeChat ={handleChatChange}
       />
     {
        isLoaded && currentChat === undefined ? ( 
       <Welcome
        currentUser = {currentUser} 
         />  
         ) :  
          (  
             
            <ChatContainer currentChat = {currentChat} currentUser = {currentUser} socket = {socket}/> 
          
         ) 
        }
     </div>

   </Container>
   
  )
}

const Container = styled.div`
height:100vh;
width:100vw;
display:flex;
flex-direction:column;
justify-content:center;
gap : 1rem;
align-items : center;
background-color:#131324;
.container{
  height:85vh;
  width:85vw;
  background-color: #00000076;
  display:grid;
  grid-template-columns:25% 75%;
  @media screen and (min-width : 720px) and (max-width:1080px){
    grid-template-columns:35% 65%;
  }
  @media screen and (min-width : 360px) and (max-width:480px){
    grid-template-columns:35% 65%;
  }
}
`;

export default Chat
