

export interface Event {
    id?: number;
    title: string;
    venue?: number;
    date: string;
    description: string;
    presentar?: string;
    price?: number;
}




const predefinedEventList: Event[] = [
    {
        id: 1,
        title: "Spring Music Festival",
        venue: 101,
        date: new Date("2025-04-15T18:00:00Z").getTime(), 
        description: "Join us for an evening of live music featuring local artists.",
        presentar: "John Doe",
        price: 20.00,
    },
    {
        id: 2,
        title: "Art Exhibition Opening",
        venue: 102,
        date: new Date("2025-05-10T15:00:00Z").getTime(), 
        description: "Explore contemporary art from emerging artists.",
        presentar: "Jane Smith",
        price: 10.00,
    },
];

    let EventList: Event[] = predefinedEventList;


export const fetchEvents = async (): Promise<Event[]> => {
    return EventList;
}
