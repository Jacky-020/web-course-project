import {  gql, ApolloClient, InMemoryCache } from '@apollo/client';
import { Venue } from './FetchVenues';

export interface Event {
    id?: number;
    title: string;
    venue?: Venue;
    date: string;
    description: string;
    presenter?: string;
    price?: string;
}



const predefinedEventList: Event[] = [
    {
        id: 1,
        title: "Spring Music Festival",

        date: "2025-04-15T18:00:00Z", 
        description: "Join us for an evening of live music featuring local artists.",
        presenter: "John Doe",
        price: '20.00',
    },
    {
        id: 2,
        title: "Art Exhibition Opening",

        date: "2025-05-10T15:00:00Z", 
        description: "Explore contemporary art from emerging artists.",
        presenter: "Jane Smith",
        price: '10.00',
    },
];

const GET_EVENTS = gql`
query{
    events {
        id
        en_title
        venue{
          latitude
          longitude
        }
        date_e
        duration
        presenter_e
        price_e
        desc_e
    }
}
`;

const client = new ApolloClient({
    uri: 'http://localhost:5173/api/graphql/events',
    cache: new InMemoryCache(),
});

export const fetchEvents = async (): Promise<Event[]> => {
    let eventList: Event[] = predefinedEventList;

    const { data } = await client.query({ query: GET_EVENTS });
    eventList = eventList = data.events
    // .filter(event => event.venue !== null && event.venue.latitude !== null && event.venue.longitude !== null)
    .map((event: { id: any; en_title: any; venue: { latitude: any; longitude: any; }; date_e: any; desc_e: any; presenter_e: any; price_e: any; }) => ({
        id: event.id,
        title: event.en_title,
        venue: {
            latitude: event.venue.latitude,
            longitude: event.venue.longitude,
        },
        date: event.date_e,
        description: event.desc_e,
        presenter: event.presenter_e,
        price: event.price_e,
    }));

    return eventList;
}
