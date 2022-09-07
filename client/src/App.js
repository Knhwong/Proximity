import './App.css';
import React, { useState} from 'react';



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
    <div className = "bg-slate-800 w-full p-1 flex flex-row justify-end items-center space-x-1 border border-orange-600">
      <div className="text-slate-100 font-thin">Longitude: {long} | Latitude: {lat}</div>
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
    <form onSubmit={handleSubmit} className="flex flex-row w-full bg-slate-100 shadow items-center border border-orange-600 p-2 space-x-1">
      <input
        type="text"
        className="bg-slate-250 py-1 px-2 w-full rounded shadow border appearance-none focus:outline-none text-gray-700" 
        value={input}
        onChange={(e) => setInput(e.target.value)}
        autoFocus
      />
      <button className="bg-slate-500 hover:bg-slate-800 px-2 py-1 whitespace-nowrap text-white font-bold rounded shadow">Click Me</button>
    </form>
  )
}


function Messages(props) {
  return (
    <ul className="bg-slate-100 p-5 w-full h-96 flex-col-reverse overflow-auto snap-y rounded shadow border border-orange-600">{
      props.msg.map((m) => 
          { return <li key={m.id} className = "text-left text-black">{m.msg}</li>}
        )
      }
    </ul>
  )
}

function App() {

  const [msgs, setMsgs] = useState([]);


  function setMessages(message) {
    const newMsg = {
      msg: message,
      id: msgs.length + 1
    }


    var newMessages = [...msgs, newMsg]
    setMsgs(newMessages)
  }


  return (
    <div className="bg-black h-full flex flex-col justify-center items-center p-5">
      <GeoInfo />
      <Messages msg={msgs} />
      <InputBox setMsg={setMessages} />
    </div>
  );
}

export default App;
