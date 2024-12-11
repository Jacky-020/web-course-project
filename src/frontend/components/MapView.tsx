import React, { useEffect, useState, Suspense } from 'react';
import { GoogleMap, GoogleMapApiLoader, Marker, InfoWindow } from 'react-google-map-wrapper';
import 'bootstrap/dist/css/bootstrap.min.css';
import {fetchVenues, Venue} from './FetchVenues'; 
import { LatLng } from 'google.maps'; 

import { googleMapApiKey } from '../config/googleMapApiKey';

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

    // Define the props for the Content component
    interface ContentProps {
        location: string;
    }

    const Content: React.FC<ContentProps> = ({ location }) => {
        return (
            <div id='content'>
                <p id='firstHeading' className='firstHeading'>{location}</p>
            </div>
        );
    };

    return (
        <div className="container-fluid" style={{ height: '100vh' }}>
            <GoogleMapApiLoader apiKey={googleMapApiKey}>
                <Suspense fallback={<div>Loading...</div>}>
                    <GoogleMap 
                        className="w-100" // Full width
                        zoom={17} 
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
                                content={<Content location={selectedVenue.location} />}
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