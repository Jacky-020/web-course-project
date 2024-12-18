// used both in general-search and my-favourite page, display controlled by props {selectable}
import { SetStateAction, useState } from 'react';
import DataTable from 'react-data-table-component';
import { Venue } from './FetchVenues';
import { useTheme } from '../Theme/ThemeProviderHooks';
import { useNavigate } from 'react-router-dom';
import { gql, useMutation } from '@apollo/client';

const columns = [
  {
    name: 'id',
    sortable: true, 
    selector: (row: Venue) => row.id,
  },
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
    selector: (row: Venue) => row.latitude? row.latitude.toFixed(4): '',
    sortable: true,
  },
  {
    name: 'Longitude',
    selector: (row: Venue) => row.longitude? row.longitude.toFixed(4): '',
    sortable: true,
  },
  {
    name: 'Distance from you (km)',
    selector: (row: Venue) => row.distance? row.distance.toFixed(2): '',
    sortable: true,
  }
];

const FAVORITE_VENUE = gql`
    mutation favouriteLocation($id: Int!) {
        favouriteLocation(id: $id) {
            id
        }
    }
`;

interface LocationTableProps<T> {
  data: T[];
  selectable: boolean; // if it is allow to add venues to favourite
}

function LocationTable<T>({ data , selectable}: LocationTableProps<T>) {
  const [favouriteLocation] = useMutation(FAVORITE_VENUE);
  const [selectedRows, setSelectedRows] = useState<Venue[]>([]);
  const theme = useTheme();

  function handleSelectedRowsChange (state: { selectedRows: SetStateAction<never[]>; })  {
    setSelectedRows(state.selectedRows); // Directly use selectedRows from the state
  };



  function addFavourite() {
    for(const row of selectedRows){
      favouriteLocation({
          variables: {
              id: row.id,
          },
      }).then((result) => {
      });
    }
    alert('Add to favourite successfully');
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
