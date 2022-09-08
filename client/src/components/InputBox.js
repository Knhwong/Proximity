import React, { useState} from 'react';
import {ReactComponent as Chevron} from './chevron.svg';

function InputBox(props) {

  const [input, setInput] = useState("")
  
  const handleSubmit = (event) => {
    event.preventDefault();
    if (input !== "") {
      props.useMsg(input)
    }
    setInput("")
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-row w-full bg-slate-800 shadow items-center border border-slate-500 border-t-0 p-2 space-x-1">
      <input
        type="text"
        className="bg-slate-250 py-1 px-2 w-full rounded shadow border appearance-none focus:outline-none text-gray-700" 
        value={input}
        onChange={(e) => setInput(e.target.value)}
        autoFocus
      />
      <button className="bg-slate-500 border-slate-500 hover:bg-slate-700 py-1 px-2 h-9 w-12 rounded shadow"><Chevron className = "object-center object-fill" /></button>
    </form>
  )
}

export default InputBox;