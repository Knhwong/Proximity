import './App.css';
import React, { useState } from 'react';



function GeoInfo() {
  const [long, setlong] = useState("")
  const [lat, setlat] = useState("")
  const setLongLat = (position) => {
    setlong(position.coords.latitude)
    setlat(position.coords.longitude)
  }

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(setLongLat)
  }

  return (
    <div>
      <div className="text-white">Longitude is {long}</div>
      <div className="text-white">Latitude is {lat}</div>
    </div>
  )
}

function InputBox(props) {
  const [input, setInput] = useState("")
  const handleSubmit = (event) => {
    event.preventDefault();
    if (input !== "") {
    props.setMsg(input)
    }
    setInput("")
  }
  return (
    <form onSubmit={handleSubmit} className="flex-row justify-center items-center">
      <input
        type="text"
        className="w-full bg-slate-500"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        autoFocus
      />
      <button className="text-white">Click Me</button>
    </form>
  )
}


function Messages(props) {
  return (
    <ul>{
      props.msg.map((m) => 
          { return <li key={m.id} className = "text-left text-white">{m.msg}</li>}
        )
      }
    </ul>
  )
}

function App() {

  const [msgs, setMsgs] = useState([])

  function setMessages(message) {
    const newMsg = {
      msg: message,
      id: msgs.length + 1
    }


    var newMessages = [newMsg, ...msgs]
    setMsgs(newMessages)
  }


  return (
    <div className="bg-slate-900 h-auto">
      <GeoInfo />
      <Messages msg={msgs} />
      <InputBox setMsg={setMessages} />
    </div>
  );
}

export default App;
