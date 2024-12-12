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

    function Detail(){
        return(

            <div className="card" style={{width: "18rem;"}}>
            <div className="card-body">
              <h5 className="card-title">{selectedVenue? selectedVenue.location: 'Not selected'}</h5>
              <h6 className="card-subtitle mb-2 text-muted">Card subtitle</h6>
              <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
              <a href="#" className="card-link">Card link</a>
              <a href="#" className="card-link">Another link</a>
            </div>
          </div>
        )
    }

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
          {selectedVenue ? (
            <Detail/>
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