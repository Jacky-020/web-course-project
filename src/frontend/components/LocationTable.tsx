// used both in general-search and my-favourite page, display controlled by props {selectable}
import { SetStateAction, useState } from 'react';
import DataTable from 'react-data-table-component';
import { Venue } from './FetchVenues';
import { useTheme } from '../Theme/ThemeProviderHooks';
import { useNavigate } from 'react-router-dom';

const columns = [
  {
    name: 'Location',
    sortable: true,
    cell: (row: Venue) => {
        const navigate = useNavigate(); 
        return (
            <a href="#" onClick={(e) => {
                e.preventDefault();
                navigate('/VenueDetail', { state: { selectedVenue: row } }); 
            }}>
                {row.location}
            </a>
        );
    },
  },
  {
    name: 'category',
    selector: (row: Venue) => row.category,
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
    name: 'Distance (in km)',
    selector: (row: Venue) => row.distance,
    sortable: true,
  }
];

interface LocationTableProps<T> {
  data: T[];
  selectable: boolean; // if it is allow to add venues to favourite
}

function LocationTable<T>({ data , selectable}: LocationTableProps<T>) {
  const [selectedRows, setSelectedRows] = useState([]);
  const theme = useTheme();

  function handleSelectedRowsChange (state: { selectedRows: SetStateAction<never[]>; })  {
    setSelectedRows(state.selectedRows); // Directly use selectedRows from the state
  };

  function addFavourite(){
    alert(`Selected Rows: ${JSON.stringify(selectedRows)}`);
  };

  return (
    <div className='m-1'>
      <DataTable
        columns={columns}
        data={data}
        pagination 
        highlightOnHover 
        dense
        selectableRows = {selectable}
        persistTableHead={true}
        onSelectedRowsChange={handleSelectedRowsChange} 
        theme={theme === 'light' ? 'default' : 'dark'}
        />
      {selectable && 
        <button  onClick={addFavourite}  
          className="btn btn-outline-success mt-3 btn-sm"
          disabled={selectedRows.length === 0}>
          Add to favourites
        </button>
      }
    </div>
  );
}

export default LocationTable;
