import './App.css';
import React, { useState, useEffect} from 'react';
import io from 'socket.io-client';

import ChatBox from './components/ChatBox.js';
import GeoInfo from './components/GeoInfo.js'
import InputBox from './components/InputBox.js';



const socket = io("ws://localhost:3001");

function App() {

  const [messages, setMessages] = useState([]);
  const [geoLocationEnabled, setGeolocationEnabled] = useState(false);
  const [position, setPosition] = useState({longitude: "NULL", latitude: "NULL"});
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [nearby, setNearby] = useState([]);

  function sendMessages(message) {
    console.log(messages);
    if (message && isConnected) {
      socket.emit('message', {
          'msg': message,
          "long": position.Longitude,
          "lati": position.Latitude,
          "timestamp": new Date()
      });
  }
  }

  useEffect(() => {
    
    socket.on('connect', () => {
      setIsConnected(true);
      console.log("Is Connected");
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('message', (msg) => {
        setMessages((prevMessages) => {
          const newMessages = [{ msg: msg, id: prevMessages.length + 1}, ...prevMessages]
          return newMessages;
        })
      
    })

    
    if (navigator.geolocation) {
      setGeolocationEnabled(true);
      navigator.geolocation.watchPosition( (position) => {
        const coords = {longitude: position.coords.longitude, latitude: position.coords.latitude}
        setPosition(coords);
        if (isConnected) {
          socket.emit("geo", coords)
        }
      })
    } else {
      setGeolocationEnabled(false);
    }

    socket.on('geo', (res) => {
      setNearby(res);
    })
    

    return () => {
      socket.off('connect');
      socket.off('message');
      socket.off('disconnect');
    }

  }, [isConnected]);


  return (
    <div className="h-full flex flex-col justify-center items-center p-3 bg-black app">
      <GeoInfo position = {position} nearby = {nearby} geoEnabled = {geoLocationEnabled}/>
      <ChatBox msg = {messages} />
      <InputBox useMsg = {sendMessages} />
    </div>
  );
}

export default App;
