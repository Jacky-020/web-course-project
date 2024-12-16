import { Suspense, useEffect, useState } from 'react';
import { GoogleMap, GoogleMapApiLoader, InfoWindow, Marker } from 'react-google-map-wrapper'; 
import { Loader } from '@googlemaps/js-api-loader';
import { googleMapApiKey } from '../config/googleMapApiKey';
import { useLocation } from 'react-router-dom';
import { Venue } from './FetchVenues';



  


function VenueDetail() {
    const location = useLocation();
    const [selectedVenue, setSelectedVenue] = useState<Venue | undefined>(undefined);
    const [venueDetail, setVenueDetail] = useState<google.maps.places.Place>();
    

    useEffect(() => {
        const { state } = location; 
        if (state && state.selectedVenue) {
            setSelectedVenue(state.selectedVenue); 
        }
    }, [location]);

    useEffect(() => {
      async function retrieveVenueDetail() {
        if(selectedVenue){
          const result = await fetchVenueDetail(selectedVenue.latitude, selectedVenue.longitude, selectedVenue.location);
          setVenueDetail(result);
        }
      }
      retrieveVenueDetail();
    }, [selectedVenue]);





    async function fetchVenueDetail(lat: number, lng: number, location: string): Promise<google.maps.places.Place> {
  

          const loader = new Loader({
              apiKey: googleMapApiKey,
              version: "weekly",
              libraries: ["places"]
          });
  
          return loader.load().then(async (google) => {

            const { Place } = await google.maps.importLibrary("places") as google.maps.PlacesLibrary;
            const request1 = {
                textQuery: location,
                fields: ["displayName", "formattedAddress", "location", "reviews"],
                locationBias: { lat: lat, lng: lng },
                isOpenNow: false,
                maxResultCount: 1,
                minRating: 0,
            };
            const { places } = await Place.searchByText(request1);  
            return places[0];
          } 
        );
    }

    function Content () {
        if (!venueDetail) {
            return <div>Loading venue details...</div>; // Handle loading state
        }
    
        const place = venueDetail;
        const review = place.reviews && place.reviews.length > 0 ? place.reviews[0] : null;
    
        if (!review) {
            return <div>No reviews available.</div>; // Handle no reviews case
        }
    
        const reviewRating = review.rating;
        const reviewText = review.text;
        const authorName = review.authorAttribution?.displayName || '';
        const authorUri = review.authorAttribution?.uri || '';
    
        return (
            <div id='content'>
                <div id="title"><b>{place.displayName}</b></div>
                <div id="address">{place.formattedAddress}</div>
                <a href={authorUri} target="_blank" rel="noopener noreferrer">Author: {authorName}</a>
                <div id="rating">Rating: {reviewRating} stars</div>
                <div id="review"><p>Review: {reviewText}</p></div>
            </div>
        );
    };
    
    function Detail() {
        return (
            <div className="card" style={{ width: "18rem" }}>
                <div className="card-body">
                    <h5 className="card-title">{selectedVenue ? selectedVenue.location : 'Not selected'}</h5>
                    <p className="card-text">{venueDetail?.rating}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container col" style={{ height: '100vh' }}>
            <div className="container-fluid" style={{ height: '100vh' }}>
                <div className="row h-100">
                            <div className="col-9">
                    <GoogleMapApiLoader apiKey={googleMapApiKey}>
                        <Suspense fallback={<div>Loading...</div>}>
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
                                        {selectedVenue && (
                                            <InfoWindow 
                
                                                position={{ lat: selectedVenue.latitude, lng: selectedVenue.longitude }}
                                                open={true}
                                                content={<Content />}
                                            >
                                            </InfoWindow>
                                        )}
                                    </GoogleMap>
                                ) : (
                                    <div>Loading venue details...</div>
                                )}
                        </Suspense>
                    </GoogleMapApiLoader>
                            </div>         
                    <div className="col-3">
                        {selectedVenue ? (
                            <Detail />
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