export interface Venue {
    id: number;
    location: string;
    latitude: number;
    longitude: number;
    eventNum: number;
}

export const fetchVenues = (): Venue[] => {
    const predefinedData: Venue[] = [
        {
            id: 1,
            location: 'North District Town Hall (Auditorium)',
            latitude: 22.501639,
            longitude: 114.128911,
            eventNum: 4,
        },
        {
            id: 2,
            location: 'Place 2',
            latitude: 12.03,
            longitude: 101.04,
            eventNum: 5,
        },
    ];

    return predefinedData;
};

