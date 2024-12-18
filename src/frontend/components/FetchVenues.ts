import { useQuery, gql, ApolloClient, InMemoryCache } from '@apollo/client';

export interface Venue {
    id?: number;
    location: string;
    category?: string;
    latitude: number;
    longitude: number;
    eventNum?: number;
    distance?: number;
}




    const predefinedVenueList: Venue[] = [
        {
            id: 1,
            location: 'North District Town Hall (Auditorium)',
            category: "Auditorium",
            latitude: 22.501639,
            longitude: 114.128911,
            eventNum: 4,
        },
        {
            id: 2,
            location: "Sha Tin Town Hall (Dance Studio)",
            category: "Dance Studio",
            latitude: 22.38136,
            longitude: 114.1899,
            eventNum: 5,
        },
    ];

    

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
const client = new ApolloClient({
    uri: 'http://localhost:5173/api/graphql/locations',
    cache: new InMemoryCache(),
});

const GET_LOCATIONS = gql`
  query {
    locations {
      id
      chi_name
      en_name
      latitude
      longitude
    }
  }
`;

export const fetchVenues = async (): Promise<Venue[]> => {


    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
            async (position: GeolocationPosition) => {
                const userLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };


                let venueList = predefinedVenueList;
                // venueList = await fetch();  
                const { data } = await client.query({ query: GET_LOCATIONS });
                console.log(data.locations)

                // caclulate and add distance field, may alson need to extract and add category field
                venueList = data.locations
                .filter(location => location.latitude !== null && location.longitude !== null)
                .map(location => {
                    // Use regex to extract the category from en_name
                    const regex = /\((.*?)\)/;
                    const matches = regex.exec(location.en_name);
                    const category = matches ? matches[1] : ''; 
            
                    return {
                        id: location.id,
                        category: category, // Set the extracted category
                        location: location.en_name,
                        latitude: location.latitude,
                        longitude: location.longitude,
                        distance: calculateDistance(userLocation.lat, userLocation.lng, location.latitude, location.longitude),
                    };
                });
                resolve(venueList); // Resolve with the new venue list
            },
            (error) => {
                reject(error); // Handle geolocation errors
            }
        );
    });
}
