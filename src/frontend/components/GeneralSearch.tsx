import React, { useState, useEffect, memo, useDeferredValue } from 'react';
import {fetchVenues, Venue} from './FetchVenues';
import LocationTable from './LocationTable';
import MapView from './MapView';



const predefinedVenue = {
  id: 1,
  location: 'North District Town Hall (Auditorium)',
  latitude: 22.501639,
  longitude: 114.128911,
  eventNum: 4,
  distance: 1,
}
function GeneralSearch(){
    

      const [filteredData, setFilteredData] = useState<Venue[]>([]);
      const [keyword, setKeyword] = useState<string>('');
      const searchTerm = useDeferredValue(keyword);
      const [distanceLimit, setDistanceLimit] = useState<number>(200);
      const [data, setData] = useState<Venue[]>([]); 


      useEffect(() => {
        const loadVenues = async () => {
            try {
                const venues = await fetchVenues();
                setData(venues);
                setFilteredData(venues);
           
            } catch (error) {
                console.error("Error fetching venues:", error);
            }
        };

        loadVenues(); // Call the async function
    }, []);

      const handleSearch = () => {
        const filteredData = data.filter(row => 
          (row.location.toLowerCase().includes(searchTerm.toLowerCase()) || searchTerm.trim() === '') &&
          row.distance <= distanceLimit
        );
        setFilteredData(filteredData);
      };






    
      function DistanceSlider() {
        // prevent rendering of whole page during sliding, which is very laggy
        const [distanceSelected, setDistanceSelected] = useState(distanceLimit); 
        return (
          <div className='col m-2 '>
            <input
              type="range"
              min="1"
              max="200"
              id="distanceRange"
              value={distanceSelected}
              step="3"
              onChange={e => setDistanceSelected(parseFloat(e.target.value))}
              onBlur={()=> setDistanceLimit(distanceSelected)} // update whole page when released
            />
            <div>Distance within : {distanceSelected} km</div>
          </div>
        );
      }


    //   const InputGroup = () =>{
    //     return(
    //         <div className='input-group' aria-describedby="addon-wrapping">
    //             <input
    //             type="search"
    //             className="form-control-sm border ps-3 m-2"
    //             placeholder="Search locations"
    //             value={searchTerm}
    //             onChange={(e)=>setKeyword(e.target.value)} 
    //             />
    //         <DistanceSlider/>
    //         <button 
    //           className="btn btn-outline-secondary" 
    //           type="button" 
    //           id="button-addon1" 
    //           onClick={handleSearch} // Trigger search on button click
    //         >
    //           Search
    //         </button>
    //       </div>
    //     )
    //   }
      return(
        <div className='w-100'>      
            <div className='input-group ' aria-describedby="addon-wrapping">
                <input
                type="search"
                className="form-control-sm border ps-3 m-2"
                placeholder="Search locations"
                value={searchTerm}
                onChange={(e)=>setKeyword(e.target.value)} 
                />
                <DistanceSlider/>
                <button 
                className="btn btn-outline-secondary btn-light m-2  mt-3" 
                type="button" 
                id="button-addon1" 
                onClick={handleSearch} // Trigger search on button click
                >
                Apply filter
                </button>
            </div>
            <LocationTable data={filteredData} selectable={true} />
            <MapView data={filteredData} />          
        </div>
      )
}


export default GeneralSearch;