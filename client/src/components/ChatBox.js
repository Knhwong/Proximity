import React from 'react';


function ChatBox(props) {
    return (
      <ul className="bg-slate-800 p-2 w-full h-96 flex flex-col-reverse overflow-auto snap-y shadow border border-slate-500">{
        props.msg.map((m) => 
            { return <li key={m.id} className = "text-left text-sm text-white font-thin">{m.msg}</li>}
          )
        }
      </ul>
    )
}

export default ChatBox;