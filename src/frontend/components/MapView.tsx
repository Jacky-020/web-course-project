import React, { useEffect, useState, Suspense } from 'react';
import { GoogleMap, GoogleMapApiLoader, Marker, InfoWindow } from 'react-google-map-wrapper';
import 'bootstrap/dist/css/bootstrap.min.css';
import { LatLng } from 'google.maps'; 

import {fetchVenues, Venue} from './FetchVenues'; 
import { googleMapApiKey } from '../config/googleMapApiKey';
import { useNavigate } from 'react-router-dom';

const MapView: React.FC = () => {
    const [venues, setVenues] = useState<Venue[]>([]);
    const [centerLocation, setCenterLocation] = useState<LatLng>({ lat: 37.5709413, lng: 126.977787 });
    const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);



    useEffect(() => {
        const loadVenues = async () => {
            try {
                const data = await fetchVenues();
                console.log("Fetched Locations:", data); // Debugging
                if (Array.isArray(data) && data.length > 0) {
                    setVenues(data);
                    setCenterLocation({
                        lat: data[0].latitude,
                        lng: data[0].longitude
                    });
                } else {
                    console.error("Fetched data is not a valid array or is empty:", data);
                }
            } catch (error) {
                console.error("Error fetching locations:", error);
            }
        };

        loadVenues();
    }, []);

    interface ContentProps {
        venue: Venue; 
      }

    const Content: React.FC<ContentProps> = ({ venue }) => {
        const navigate = useNavigate();
      
        function handleClicking(event: React.MouseEvent) {
          event.preventDefault(); 
          navigate('/VenueDetail', { state: { selectedVenue: venue } });
        }
      
        return (
          <div id='content'>
            <button onClick={handleClicking} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}>
              <p id='firstHeading' className='firstHeading'>{venue.location}</p>
            </button>
          </div>
        );
      };

    return (
        <div className="container-fluid" style={{ height: '100vh' }}>
            <GoogleMapApiLoader apiKey={googleMapApiKey}>
                <Suspense fallback={<div>Loading...</div>}>
                    <GoogleMap 
                        className="w-100" // Full width
                        zoom={12} 
                        center={centerLocation}
                        style={{ height: '100%' }} // Full height
                    >
                        {venues.map(venue => (
                            <Marker 
                                key={venue.id} 
                                lat={venue.latitude} 
                                lng={venue.longitude} 
                                onClick={() => {
                                    setSelectedVenue(venue); 
                                }} 
                            />
                        ))}
                        {selectedVenue && (
                            <InfoWindow 
                                onCloseClick={() => {
                                    setSelectedVenue(null); 
                                }} 
                                position={{ lat: selectedVenue.latitude, lng: selectedVenue.longitude }}
                                open={true}
                                content={<Content venue={selectedVenue} />}
                            >
                            </InfoWindow>
                        )}
                    </GoogleMap>
                </Suspense>
            </GoogleMapApiLoader>
        </div>
    );
}

export default MapView;