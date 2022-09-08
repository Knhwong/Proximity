import React, {useState, useEffect} from 'react';


function GeoInfo(props) {
  const [info, setInfo] = useState("Connecting...")
  useEffect(() => {

    if (props.geoEnabled) {
      if (props.nearby.length > 0) {
        const newInfo = `${props.nearby.length - 1} users nearby`;
        setInfo(newInfo);
      } else {
        setInfo("Connecting...");
      }

    } else {
      setInfo("Geolocation Disabled")
    }



  })

  return (
    <div className = "bg-slate-900 w-full p-1 flex flex-row justify-between items-center space-x-1 border border-b-0 border-slate-500">
      <div className="text-slate-100 whitespace-nowrap font-thin md:text-base sm:text-sm">{info}</div>
      <div className = "flex justify-end flex-wrap items-center space-x-2">
        <div className="text-slate-100 font-thin md:text-base sm:text-sm whitespace-nowrap">Latitude: {props.position.latitude}</div>
        <div className="text-slate-100 font-thin md:text-base sm:text-sm whitespace-nowrap">Longitude: {props.position.longitude}</div>
      </div>
    </div>
  )
}

export default GeoInfo;