import React, { useEffect, useState, Suspense } from 'react';
import { GoogleMap, GoogleMapApiLoader, Marker, InfoWindow } from 'react-google-map-wrapper';
import { googleMapApiKey } from '../config/googleMapApiKey';
import { useLocation } from 'react-router-dom';
import {Venue} from './FetchVenues';

function VenueDetail(){
    const location = useLocation();
    const [selectedVenue, setSelectedVenue] = useState<Venue | undefined>(undefined);
  
    useEffect(() => {
      const { state } = location; 
      if (state && state.selectedVenue) {
        setSelectedVenue(state.selectedVenue); 
        console.log(state.selectedVenue); 
      }
    }, [selectedVenue]);
    return (
        <div className="container col" style={{ height: '100vh' }}>
             <div className="container-fluid" style={{ height: '100vh' }}>
      <div className="row h-100">
        <div className="col-9">
          {selectedVenue ? (
            <GoogleMap 
              className="w-100" 
              zoom={15} 
              center={{ lat: selectedVenue.latitude, lng: selectedVenue.longitude }}
              style={{ height: '100%' }} 
            >
              <Marker 
                lat={selectedVenue.latitude} 
                lng={selectedVenue.longitude} 
              />
            </GoogleMap>
          ) : (
            <div>Loading venue details...</div>
          )}
        </div>
        <div className="col-3">
          <h1>Details</h1>
          {selectedVenue ? (
            <div>
              <p>Location: {selectedVenue.location}</p>
              <p>Latitude: {selectedVenue.latitude}</p>
              <p>Longitude: {selectedVenue.longitude}</p>
              <p>Number of Events: {selectedVenue.eventNum}</p>
            </div>
          ) : (
            <p>No venue data available.</p>
          )}
        </div>
      </div>
    </div>
        </div>
    );
}

export default VenueDetail;