import { Suspense, useEffect, useState } from 'react';
import { GoogleMap, GoogleMapApiLoader, InfoWindow, Marker } from 'react-google-map-wrapper'; 
import { Loader } from '@googlemaps/js-api-loader';
import { googleMapApiKey } from '../config/googleMapApiKey';
import { useLocation, useNavigate } from 'react-router-dom';
import { Venue } from './FetchVenues';

import Carousel from 'react-bootstrap/Carousel';


function VenueDetail() {
    const location = useLocation();
    const [selectedVenue, setSelectedVenue] = useState<Venue | undefined >(undefined); // the venue to be displayed
    const [venueDetail, setVenueDetail] = useState<google.maps.places.Place[]>(); // info of venue visited (up to 3)
    

    useEffect(() => {
        function trackVenue(){
            const { state } = location; 
            if (state && state.selectedVenue) {
                let chosenVenue = state.selectedVenue;
                // remove the (category), which reduce textsearch accuracy in google map api
                chosenVenue.location = state.selectedVenue.location.replace(/\s*\([^)]*\)/g, '').trim();
                setSelectedVenue(chosenVenue); 
                // Retrieve existing venues from localStorage
                const savedVenue = JSON.parse(localStorage.getItem('venueList')) || [];
                let updatedVenue = [...savedVenue]; // Combine existing and new venue
                updatedVenue = updatedVenue.filter(venue => venue.location !== chosenVenue.location); // remove duplicate
                updatedVenue.push(chosenVenue);
                // Limit to the last 3 venues
                if (updatedVenue.length > 3) {
                    updatedVenue = updatedVenue.slice(-3); 
                }
                localStorage.setItem('venueList', JSON.stringify(updatedVenue));
            }
        }

        trackVenue();
    }, [location]);

    useEffect(() => {
        async function retrieveVenueDetail() {
            const savedVenue = JSON.parse(localStorage.getItem('venueList')) || [];
            const result = []; 
        
            for (const venue of savedVenue) {
                const detail = await fetchVenueDetail(venue.latitude, venue.longitude, venue.location);
                result.push(detail); 
            }
        
            setVenueDetail(result); 
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
                textQuery: location.replace(/\s*\([^)]*\)/g, '').trim(),
                fields: ["displayName", "formattedAddress", "location", "reviews", "photos"],
                locationBias: {
                    center: { lat: lat, lng: lng },
                    radius: 1 
                },
                maxResultCount: 1,
                minRating: 0,
            };
            const { places } = await Place.searchByText(request1);  
            return places[0];
          } 
        );
    }

    // Carousel on the right panel
    function ControlledCarousel() {
        const navigate = useNavigate(); 
        const [index, setIndex] = useState(0);
        if (!venueDetail) {
            return <div>Loading venue details...</div>; // Handle loading state
        }
        
        const handleSelect = (selectedIndex) => {
          setIndex(selectedIndex);
        };
      
        return (
            <div>
          <Carousel activeIndex={index} onSelect={handleSelect}>
            {venueDetail.map((venue, index) => (
                <Carousel.Item key={index} >
                    <div onClick={() => {
                        navigate('/VenueDetail', { state: { selectedVenue: {
                            latitude: venueDetail[index].location?.lat(),
                            longitude: venueDetail[index].location?.lng(),
                            location: venueDetail[index].displayName,
                    } } }); 
                    }}>
                    <img 
                        src={venue.photos[0].getURI({ maxWidth: 50, maxHeight: 50 })} 
                        alt={`Slide ${index + 1}`} 
                        className="d-block w-100" 
                        
                    />
                    <Carousel.Caption>
                        <h3>{venue?.displayName || ''}</h3>
                    </Carousel.Caption>
                    </div>
                </Carousel.Item>
            ))}
          </Carousel>
          </div>
        );
      }

    // content in infoWindow
    function Content () {
        const [reviewNum, setReviewNum] = useState(0);
        
        if (!venueDetail) {
            return <div>Loading venue details...</div>; // Handle loading state
        }
        
        const place = venueDetail[venueDetail.length - 1];
        const review = place.reviews && place.reviews.length > 0 ? place.reviews[reviewNum] : null;
        
        if (!review) {
            return <div>No reviews available.</div>; // Handle no reviews case
        }
        
        const reviewRating = review.rating;
        const reviewText = review.text;
        const authorName = review.authorAttribution?.displayName || '';
        const authorUri = review.authorAttribution?.uri || '';
        const photoUrl = place.photos[0]; 

        function findAverageRating(){
            if(!place.reviews || place.reviews.length === 0){
                return 0;
            }
            const averageRating:number = place.reviews.reduce((sum:number, review:google.maps.places.Review) => 
                sum + (review.rating || 0), 0) / place.reviews.length;
            return averageRating;
        }
        const averageRating = findAverageRating();
        function incrementReviewNum(){
            let newReviewNum = reviewNum;
            if(place.reviews){
                ++newReviewNum;
                if(newReviewNum >= place.reviews.length){
                    newReviewNum = 0;
                }
            } 
            setReviewNum(newReviewNum);
        }
        return (
            <div id='content' className='text-dark'>
                <img src={photoUrl.getURI({maxWidth: 150, maxHeight: 150})} ></img>
                <div id="title"><b>{place.displayName}</b></div>
                <div id="address">{place.formattedAddress}</div>
                <div id="average-ratings">Average ratings: {averageRating}</div>
                <hr></hr>
                <span>{reviewNum + 1})</span> 
                <a href={authorUri} target="_blank" rel="noopener noreferrer">Author: {authorName}</a>
                <div id="rating">Rating: {reviewRating} stars</div>
                <div id="review"><p>Review: {reviewText}</p></div>
                <button className="btn btn-outline-info" onClick={incrementReviewNum}> next review</button>
            </div>
        );
    };

    const handleButtonClick = () => {
        alert(`Selected Rows: ${JSON.stringify(selectedVenue)}`);
    };
    
    function Detail() {
        const [comment, setComment] = useState('');
        return (
            <div className="card w-100 mt-2">
                <div className="card-body">
                    <h5 className="card-title">{selectedVenue ? selectedVenue.location : 'Not selected'}</h5>
                    <button  onClick={handleButtonClick}  
                    className="btn btn-outline-success mt-3 btn-sm"
                    >
                    Add to favourites
                    </button>
                    <p>Leave your comment</p>
                    <textarea className="w-100" rows={3} onChange={(e)=>{setComment(e.target.value)}}></textarea>
                    <button  onClick={handleButtonClick}  
                    className="btn btn-outline-info mt-3 btn-sm"
                    >
                        submit comment
                    </button>
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
                        <ControlledCarousel/>
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