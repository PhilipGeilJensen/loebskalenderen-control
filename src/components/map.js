import GpxParser from 'gpxparser'
import React, { useEffect, useState } from 'react'
import Skeleton from '@mui/material/Skeleton';
import { MapContainer, Polyline, TileLayer, useMap, Marker, Popup } from 'react-leaflet'

export default function GpxMap(props) {
  console.log(props)
  const [loaded, setLoaded] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [positions, setPositions] = useState([])

  useEffect(() => {
    fetch("https://localhost:44381/api/Location/" + props.eventId).then(response => {
      if (response.status === 200) {
        console.log("Ok")
        response.text().then(text => {
          console.log(text)
          var gpx = new GpxParser()
          gpx.parse(text)
          console.log(gpx.tracks[0].points[0].lat)
          let pos = gpx.tracks[0].points.map(p => [p.lat, p.lon])
          setPositions(pos)
          setLoaded(true);
        })
      }
    }).catch(error => setLoadError(true))
  }, [props.event])

  if (positions.length > 0 && props.eventId !== 0) {
    return <MapContainer
      center={positions[0]}
      zoom={15}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Polyline
        pathOptions={{ fillColor: 'red', color: 'blue' }}
        positions={positions}
      />
    </MapContainer>
  } else if (loadError) {
    return <div style={{ width: '500px', height: '500px', backgroundColor: '#262626', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <span>Der var en fejl</span>
    </div>
  }
  else {
    return <Skeleton variant="rectangular" width={500} height={500} />
  }


}