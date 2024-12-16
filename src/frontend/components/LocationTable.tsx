
import { SetStateAction, useState } from 'react';
import DataTable from 'react-data-table-component';
import { Venue } from './FetchVenues';

const columns = [
  {
    name: 'Location',
    selector: (row: Venue) => row.location,
    sortable: true,
  },
  {
    name: 'Latitude',
    selector: (row: Venue) => row.latitude,
    sortable: true,
  },
  {
    name: 'Longitude',
    selector: (row: Venue) => row.longitude,
    sortable: true,
  },
  {
    name: 'Number of Events',
    selector: (row: Venue) => row.eventNum,
    sortable: true,
  },
  {
    name: 'Distance',
    selector: (row: Venue) => row.distance,
    sortable: true,
  }
];

interface LocationTableProps<T> {
  data: T[];
  selectable: boolean; // if it is allow to add venues to favourite
}

function LocationTable<T>({ data , selectable}: LocationTableProps<T>) {


  // const predefinedData: Venue[] = fetchVenues();



  // const [data, setData] = useState<Venue[]>(predefinedData);
  // const [searchTerm, setSearchTerm] = useState<string>('');
  // const [distanceLimit, setDistanceLimit] = useState<number>(200);







  // const handleSearch = () => {
  //   const filteredData = predefinedData.filter(row => 
  //     row.location.toLowerCase().includes(searchTerm.toLowerCase()) &&
  //     row.distance <= distanceLimit
  //   );
  //   setData(filteredData);
  // };

  // function DistanceSlider() {
  //   // prevent rendering of whole page during sliding, which is very laggy
  //   const [distanceSelected, setDistanceSelected] = useState(distanceLimit); 
  //   return (
  //     <div className='col m-2 '>
  //       <input
  //         type="range"
  //         min="1"
  //         max="200"
  //         id="distanceRange"
  //         value={distanceSelected}
  //         step="3"
  //         onChange={e => setDistanceSelected(parseFloat(e.target.value))}
  //         onBlur={()=> setDistanceLimit(distanceSelected)} // update whole page when released
  //       />
  //       <div>Distance within : {distanceSelected} km</div>
  //     </div>
  //   );
  // }
  const [selectedRows, setSelectedRows] = useState([]);

  const handleSelectedRowsChange = (state: { selectedRows: SetStateAction<never[]>; }) => {
    setSelectedRows(state.selectedRows); // Directly use selectedRows from the state
  };

  const handleButtonClick = () => {
    alert(`Selected Rows: ${JSON.stringify(selectedRows)}`);
  };

  return (
    <div>
      <DataTable
        columns={columns}
        data={data}
        pagination 
        highlightOnHover 
        dense
        selectableRows = {selectable}
        persistTableHead={true}
        onSelectedRowsChange={handleSelectedRowsChange} 
      />
      {selectable && 
        <button onClick={handleButtonClick}  
          className="btn btn-success mt-3"
          disabled={selectedRows.length === 0}>
          Add to favourites
        </button>
      }
    </div>
  );
}

export default LocationTable;
