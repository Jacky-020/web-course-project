import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import {fetchVenues, Venue} from './FetchVenues';





function LocationTable() {
  const predefinedColumns = [
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

  const predefinedData: Venue[] = fetchVenues();

  const [columns, setColumns] = useState<typeof predefinedColumns>([]);
  const [data, setData] = useState<Venue[]>(predefinedData);
  const [pending, setPending] = useState(true);
  const [searchTerm, setSearchTerm] = useState<string>('');


  useEffect(() => {
    const timeout = setTimeout(() => {
      setColumns(predefinedColumns);
      setPending(false);
    }, 2000);
    return () => clearTimeout(timeout);
  }, []);





  const handleSearch = () => {
    const filteredData = predefinedData.filter(row => 
      row.location.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setData(filteredData);
  };




  return (
    <div>
      <h2>Location List</h2>
      <div className='input-group' aria-describedby="addon-wrapping">
        <input
          type="search"
          className="form-control-sm border ps-3"
          placeholder="Search locations"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)} // Update search term on input change
        />
        <button 
          className="btn btn-outline-secondary" 
          type="button" 
          id="button-addon1" 
          onClick={handleSearch} // Trigger search on button click
        >
          Search
        </button>
      </div>
      <DataTable
        columns={columns}
        data={data}
        pagination // Enable pagination
        highlightOnHover // Highlight row on hover
        dense
        progressPending={pending}
      />
    </div>
  );
}

export default LocationTable;
