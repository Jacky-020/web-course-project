import React from "react";
import GoogleMapReact from 'google-map-react';
import fetchLocation from './FetchLocations';

const AnyReactComponent = ({ text }) => (
    <div style={{ color: 'white', background: 'red', padding: '5px', borderRadius: '5px' }}>
        {text}
    </div>
);

function MapView() {
    const locations = fetchLocation();
    const defaultProps = {
        center: {
            lat: locations[0].latitude,
            lng: locations[0].longitude
        },
    };


    return (
        <div style={{ height: '100vh', width: '100%' }}>
            <GoogleMapReact
                bootstrapURLKeys={{ key: "AIzaSyCPY14ecVZnp1vIPbT-XR3GJgCbsOIzX_U" }} 
                defaultCenter={defaultProps.center}
                defaultZoom={11}
            >
                {locations.map(location => (
                    <AnyReactComponent
                        key={location.id} 
                        lat={location.latitude}
                        lng={location.longitude}
                 />
                ))}
            </GoogleMapReact>
        </div>
    );
}

export default MapView;