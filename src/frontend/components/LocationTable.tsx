import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';

// Define the shape of a single location object
interface Location {
  id: number;
  location: string;
  latitude: number;
  longitude: number;
  eventNum: number;
}

function LocationTable() {
  const predefinedColumns = [
    {
      name: 'Location',
      selector: (row: Location) => row.location,
      sortable: true,
    },
    {
      name: 'Latitude',
      selector: (row: Location) => row.latitude,
      sortable: true,
    },
    {
      name: 'Longitude',
      selector: (row: Location) => row.longitude,
      sortable: true,
    },
    {
      name: 'Number of Events',
      selector: (row: Location) => row.eventNum,
      sortable: true,
    },
  ];

  const predefinedData: Location[] = [
    {
      id: 1,
      location: 'Place 1',
      latitude: 123.01,
      longitude: 10.02,
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

  const [columns, setColumns] = useState<typeof predefinedColumns>([]);
  const [data, setData] = useState<Location[]>(predefinedData);
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