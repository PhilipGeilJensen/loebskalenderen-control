import React from 'react';
import GpxMap from '../components/map';
import 'leaflet/dist/leaflet.css';
import Skeleton from '@mui/material/Skeleton';
import { MapContainer, Polyline, TileLayer, useMap, Marker, Popup, } from 'react-leaflet'

export default function Dashboard(props) {
    console.log(props);
    return <div>
        <h1>Hello there</h1>
        <div style={{ height: '500px', width: '500px' }}>
            {
                props.event !== 0 && props.event !== undefined ?
                    <GpxMap eventId={props.event}></GpxMap> :
                    <Skeleton variant="rectangular" width={500} height={500} />
            }
        </div>
    </div>
}