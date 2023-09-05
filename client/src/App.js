import './App.css';
import React, { useState, useEffect, useRef} from 'react';
import io from 'socket.io-client';

import ChatBox from './components/ChatBox.js';
import GeoInfo from './components/GeoInfo.js'
import InputBox from './components/InputBox.js';
console.log(process.env.REACT_APP_SOCKET)

const socket = io();

function App() {
  
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [messages, setMessages] = useState([]);
  const [geoLocationEnabled, setGeolocationEnabled] = useState(false);
  const [position, setPosition] = useState({longitude: "NULL", latitude: "NULL"});
  const {coords, isGeolocationAvailable, isGeolocationEnabled } =
        useGeolocated({
            positionOptions: {
                enableHighAccuracy: false,
            },
            userDecisionTimeout: 5000,
  });
  
  
  
  
  
  
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [nearby, setNearby] = useState([]);
  

  const [lng, setLng] = useState(-70.9);
  const [lat, setLat] = useState(42.35);
  const [zoom, setZoom] = useState(9);

  // Sends Messages to Server; Passed down to InputBox as props.
  function sendMessages(message) {
    console.log(messages);
    
    if (message && isConnected) {
      socket.emit('message', {
          'msg': message,
          "long": coords.longitude,
          "lati": coords.latitude,
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

    // setMessages is the state that is used to display the messages on the chatBox component
    socket.on('message', (msg) => {
        setMessages((prevMessages) => {
          const newMessages = [{ msg: msg, id: prevMessages.length + 1}, ...prevMessages]
          return newMessages;
        })
      
    })

    if (map.current == undefined) {; // initialize map only once
      map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/knhwong/cljxnjfzm003i01qjfh325xev',
      center: [lng, lat],
      zoom: zoom
      });
    }

    if (map.current && coords) {
      console.log(coords);
      map.current.flyTo({
        center: [coords.longitude, coords.latitude],
      });
    }

    
    map.current.on('move', () => {
    setLng(map.current.getCenter().lng.toFixed(4));
    setLat(map.current.getCenter().lat.toFixed(4));
    setZoom(map.current.getZoom().toFixed(2));
    });
    
    // Will send coordinates to server every time there is an update
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
      <div className="sidebar w-full">
          Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
      </div>
      <GeoInfo geoEnabled = {isGeolocationAvailable} coords = {coords} nearby = {nearby}></GeoInfo>
      <ChatBox msg = {messages} />
      <InputBox useMsg = {sendMessages} />
      <div className='w-full'>
        <div ref={mapContainer} className="map-container" />
      </div>
    </div>
  );
}

export default App;
