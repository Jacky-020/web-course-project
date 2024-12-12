import React, { useEffect, useState, Suspense} from 'react';
import { GoogleMap, GoogleMapApiLoader, Marker, InfoWindow } from 'react-google-map-wrapper';
import 'bootstrap/dist/css/bootstrap.min.css';

import { Venue} from './FetchVenues'; 
import { googleMapApiKey } from '../config/googleMapApiKey';
import { useNavigate } from 'react-router-dom';


interface MapViewProps {
    data: Venue[];
  }
  
  const MapView: React.FC<MapViewProps> = ({ data }) => {
    const [venues, setVenues] = useState<Venue[]>([]);
    const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);



    useEffect(() => {
        const loadVenues = async () => {
            try {
                setVenues(data); 
            } catch (error) {
                console.error("Error fetching locations:", error);
            }
        };
        loadVenues();
    }, [data]);

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
            <a href="" onClick={handleClicking} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}>
              <p id='firstHeading' className='firstHeading'>{venue.location}</p>
            </a>
          </div>
        );
      };

    return (
        <div className="container-fluid" style={{ height: '100vh' }}>
            <GoogleMapApiLoader apiKey={googleMapApiKey}>
                <Suspense fallback={<div>Loading...</div>}>
                    <GoogleMap 
                        className="w-100" // Full width
                        zoom={10} 
                        center={{
                            lat: 22.38136,
                            lng: 114.128911
                        }}
                        style={{ height: '70%' }} // Full height
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