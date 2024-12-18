
import { useDeferredValue, useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { Event, fetchEvents } from './FetchEvents';
import { HandThumbsUp } from 'react-bootstrap-icons';
import { OverlayTrigger, Popover } from 'react-bootstrap';
import { useTheme } from '../Theme/ThemeProviderHooks';
import { InfoCircle } from 'react-bootstrap-icons';
import { gql, useQuery } from '@apollo/client';


const GET_EVENT_META = gql`
query {
    event_meta {
        last_update
    }
}
`;
function EventTable() {
  const [filteredData, setFilteredData] = useState<Event[]>([]);
  const [keyword, setKeyword] = useState<string>('');
  const searchTerm = useDeferredValue(keyword);
  const [searchId, setSearchId] = useState<string>('');
  const [priceLimit, setPriceLimit] = useState<number>(500);
  const [likedEvents, setLikedEvents] = useState<(number | undefined) [] >([]);
  const [data, setData] = useState<Event[]>([]);
  const theme = useTheme();




  const columns = [
    {
      name: 'id',
      sortable: true,
      // cell: (row: Event) => (
      //   <a href="#" onClick={() => navigate(`/event/${row.id}`)}>
      //     {row.id}
      //   </a>
      // ),
      selector: (row: Event) => row.id,
      width: '5rem'
    },
    {
      name: 'title',
      selector: (row: Event) => row.title,
      wrap: true,
      sortable: true,
      width: "20rem" 
    },
    {
      name: 'date',
      selector: (row: Event) => row.date,
      wrap: true,
      width: "20rem"
    },
    {
      name: 'description',
      cell: (row: Event) => {
      const popoverFocus = (
          <Popover id="popover-trigger-hover-focus" title="Popover bottom" style={{fontSize: 10 }}>
            <span>{row.description}</span> 
          </Popover>
        );  
      return (
      <OverlayTrigger trigger={['hover', 'focus']}placement="bottom" overlay={popoverFocus}>
        <div  style={{ cursor: 'pointer'}} >
          <InfoCircle className='text-info'/>
        </div>
      </OverlayTrigger>);
      },
      width: "6rem" 
    },
    {
      name: 'presenter',
      selector: (row: Event) => row.presenter,
      wrap: true,
      sortable: true,
    },
    {
      name: 'price',
      selector: (row: Event) => row.price, 
      sortable: true,
      wrap: true,
      width: "6rem" 
    },
    {
      name: 'like',
      cell: (row: Event) => {
        return (
          <HandThumbsUp
            key={row.id}
            onClick={() => {
              // Toggle like status
              setLikedEvents(prev =>
                prev.includes(row.id)
                  ? prev.filter(eventId => eventId !== row.id)
                  : [...prev, row.id]
              );
            }}
            style={{ color: likedEvents.includes(row.id) ? 'blue' : 'gray' }} // Change color based on liked state
          />
        );
      },
      width: "4rem" 
    },
  ];

  useEffect(() => {
    async function getEvent() {
      const eventList = await fetchEvents();
      setData(eventList);
      setFilteredData(eventList);
    }
    getEvent();
  }, []);

  const handleSearch = () => {
    const filteredData = data.filter(row => 
      (row.title.toLowerCase().includes(searchTerm.toLowerCase()) || searchTerm.trim() === '') &&
      (row.price && Number.parseInt(row.price.replace(/[$,]/g, ''), 10) <= priceLimit) && 
      (!searchId || row.id == searchId)
    );
    setFilteredData(filteredData);
  };


  function PriceSlider() {
    // prevent rendering of whole page during sliding, which is very laggy
    const [priceSelected, setPriceSelected] = useState(priceLimit); 
    return (
      <div>
      <div className='col m-2'>
        <input
          type="range"
          min="1"
          max="500"
          id="priceRange"
          value={priceSelected}
          step="3"
          onChange={e => setPriceSelected(parseFloat(e.target.value))}
          onBlur={()=> setPriceLimit(priceSelected)} // update whole page when released
        />
        <div>Price within : {priceSelected}</div>
      </div>
      </div>
    );
  }
  
  const { data: EventMetaData } = useQuery(GET_EVENT_META);
  const [eventMeta, setEventMeta] = useState<null | string>(null);

  useEffect(() => {
    if (EventMetaData) {
          setEventMeta(EventMetaData.event_meta.last_update);
      }
  }, [EventMetaData]);
  return (
    <div className='m-1'>
      <div className='input-group d-flex justify-content-between'  aria-describedby="addon-wrapping">
              <div className='d-flex flex-row'>
                <input
                type="search"
                className="form-control-sm border ps-3 m-2 d-block "
                placeholder="Search id"
                value={searchId}
                onChange={(e)=>setSearchId(e.target.value)} 
                />
                <input
                type="search"
                className="form-control-sm border ps-3 m-2 d-block "
                placeholder="Search title"
                value={searchTerm}
                onChange={(e)=>setKeyword(e.target.value)} 
                />
                <PriceSlider/>
              </div>
              <div>
                <button 
                className="btn btn-outline-secondary btn-light m-2  mt-3 d-block" 
                type="button" 
                id="button-addon1" 
                onClick={handleSearch} // Trigger search on button click
                >
                Apply filter
                </button>
              </div>
              </div>
      {filteredData&& 
      <DataTable
        columns={columns}
        data={filteredData}
        pagination 
        highlightOnHover 
        dense
        persistTableHead={true}
        theme={theme === 'light' ? 'default' : 'dark'}
        subHeader
        subHeaderComponent={<h6>Updated On: {eventMeta ? eventMeta : ""}</h6>}
        />}
    </div>
  );
}

export default EventTable;