

export interface Venue {
    id: number;
    location: string;
    latitude: number;
    longitude: number;
    eventNum: number;
    distance: number;
}

interface venueWithoutDistance{
    id: number;
    location: string;
    latitude: number;
    longitude: number;
    eventNum: number;
}


    const predefinedVenueList: venueWithoutDistance[] = [
        {
            id: 1,
            location: 'North District Town Hall (Auditorium)',
            latitude: 22.501639,
            longitude: 114.128911,
            eventNum: 4,
        },
        {
            id: 2,
            location: "Sha Tin Town Hall (Dance Studio)",
            latitude: 22.38136,
            longitude: 114.1899,
            eventNum: 5,
        },
    ];

    let VenueList: any[] = predefinedVenueList;

    // copy from external source as google map matrix may cost money
    function calculateDistance(lat1:number, lon1:number, lat2:number,  lon2:number) : number { 
        // The math module contains a function
        // named toRadians which converts from
        // degrees to radians.
        lon1 =  lon1 * Math.PI / 180;
        lon2 = lon2 * Math.PI / 180;
        lat1 = lat1 * Math.PI / 180;
        lat2 = lat2 * Math.PI / 180;

        // Haversine formula 
        let dlon = lon2 - lon1; 
        let dlat = lat2 - lat1;
        let a = Math.pow(Math.sin(dlat / 2), 2)
            + Math.cos(lat1) * Math.cos(lat2)
            * Math.pow(Math.sin(dlon / 2),2);
        
        let c = 2 * Math.asin(Math.sqrt(a));

        // Radius of earth in kilometers. Use 3956 
        // for miles
        let r = 6371;

        // calculate the result
        return(c * r);
    }

export const fetchVenues = (): Promise<Venue[]> => {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
            (position: GeolocationPosition) => {
                const userLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };

                const venueList: Venue[] = predefinedVenueList.map(venue => ({
                    ...venue,
                    distance: calculateDistance(userLocation.lat, userLocation.lng, venue.latitude, venue.longitude),
                }));

                resolve(venueList); // Resolve with the new venue list
            },
            (error) => {
                reject(error); // Handle geolocation errors
            }
        );
    });
}
