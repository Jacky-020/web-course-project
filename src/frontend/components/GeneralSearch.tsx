import React, { useState, useEffect, memo, useDeferredValue } from 'react';
import {fetchVenues, Venue} from './FetchVenues';
import LocationTable from './LocationTable';
import MapView from './MapView';
import Dropdown from 'react-bootstrap/Dropdown';

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
      const [distanceLimit, setDistanceLimit] = useState<number>(100);
      const [data, setData] = useState<Venue[]>([]); 
      const [categories, setCategories] = useState<string[]>([]);
      const [selectedCategory, setSelectedCategory] = useState('All Categories');

      useEffect(() => {
        const loadVenues = async () => {
            try {
                const venues = await fetchVenues();
                setData(venues);
                setFilteredData(venues);
                const uniqueCategories = [...new Set(venues.map(item => item.category))];
                setCategories(uniqueCategories);
            } catch (error) {
                console.error("Error fetching venues:", error);
            }
        };

        loadVenues(); // Call the async function
    }, []);

      const handleSearch = () => {
        const filteredData = data.filter(row => 
          (row.location.toLowerCase().includes(searchTerm.toLowerCase()) || searchTerm.trim() === '') &&
          row.distance <= distanceLimit &&
          (selectedCategory === 'All Categories' || row.category === selectedCategory)
        );
        setFilteredData(filteredData);
      };

      function DropDown(){
        return(
          <Dropdown>
            <Dropdown.Toggle variant="btn btn-outline-secondary btn-light m-2  mt-3" id="dropdown-basic">
              Select categories
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={()=>setSelectedCategory("All Categories")}>
                All Categories
              </Dropdown.Item>
                {categories.length > 0 && categories.map((category:string, key:number) => (
                    <Dropdown.Item  onClick={()=>setSelectedCategory(category)}>
                        {category}
                    </Dropdown.Item>
                ))}
            </Dropdown.Menu>
          </Dropdown>
        );
      }
    
      function DistanceSlider() {
        // prevent rendering of whole page during sliding, which is very laggy
        const [distanceSelected, setDistanceSelected] = useState(distanceLimit); 
        return (
          <div className='col m-2 '>
            <input
              type="range"
              min="1"
              max="100"
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
            <div className='input-group' aria-describedby="addon-wrapping">
                <input
                type="search"
                className="form-control-sm border ps-3 m-2"
                placeholder="Search locations"
                value={searchTerm}
                onChange={(e)=>setKeyword(e.target.value)} 
                />
                <DistanceSlider/>
                <DropDown/>
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