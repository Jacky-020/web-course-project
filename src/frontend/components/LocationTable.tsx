
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
  const [selectedRows, setSelectedRows] = useState([]);

  const handleSelectedRowsChange = (state: { selectedRows: SetStateAction<never[]>; }) => {
    setSelectedRows(state.selectedRows); // Directly use selectedRows from the state
  };

  const handleButtonClick = () => {
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
      />
      {selectable && 
        <button  onClick={handleButtonClick}  
          className="btn btn-outline-success mt-3 btn-sm"
          disabled={selectedRows.length === 0}>
          Add to favourites
        </button>
      }
    </div>
  );
}

export default LocationTable;
