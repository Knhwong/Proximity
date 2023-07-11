import React, {useState, useEffect} from 'react';


function GeoInfo(props) {
  const [info, setInfo] = useState("Connecting...")
  
  const [longitude, setLng] = useState(0);
  const [latitude, setLat] = useState(0);
  useEffect(() => {

    if (props.geoEnabled) {
      if (props.nearby.length > 0) {
        const newInfo = `${props.nearby.length - 1} users nearby`;
        setInfo(newInfo);
      } else {
        setInfo("Connecting...");
      }

      if (props.coords) {
        setLng(props.coords.longitude);
        setLat(props.coords.latitude);
      }

    } else {
      setInfo("Geolocation Disabled")
    }



  })

  return (
    <div className = "bg-slate-900 w-full p-1 flex flex-row justify-between items-center space-x-1 border border-b-0 border-slate-500">
      <div className="text-slate-100 whitespace-nowrap font-bold md:text-base sm:text-sm">{info}</div>
      <div className = "flex justify-end flex-wrap items-center space-x-2">
        <div className="text-slate-100 font-bold md:text-base sm:text-sm whitespace-nowrap">Latitude: {longitude}</div>
        <div className="text-slate-100 font-bold md:text-base sm:text-sm whitespace-nowrap">Longitude: {latitude}</div>
      </div>
    </div>
  )
}

export default GeoInfo;