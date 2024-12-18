import React, { useState, useEffect, memo, useDeferredValue } from 'react';
import {fetchVenues, Venue} from './FetchVenues';
import LocationTable from './LocationTable';
import MapView from './MapView';
import { useAuthState } from '../Auth/AuthProviderHooks';



const predefinedVenue = {
  id: 1,
  location: 'North District Town Hall (Auditorium)',
  latitude: 22.501639,
  longitude: 114.128911,
  eventNum: 4,
  distance: 1,
}
function FavouriteVenue() {
  const  { user } = useAuthState();
    

    const [filteredData, setFilteredData] = useState<Venue[]>([]);
      useEffect(() => {
        const loadVenues = async () => {
            try {
                const venues = await fetchVenues(user?.id);
                setFilteredData(venues);
           
            } catch (error) {
                console.error("Error fetching venues:", error);
            }
        };

        loadVenues(); // Call the async function
    }, []);


    return(
      <div className='w-100'>      
        <LocationTable data={filteredData} selectable={false} subheader={false} />
          <MapView data={filteredData} />          
      </div>
    )
}


export default FavouriteVenue;