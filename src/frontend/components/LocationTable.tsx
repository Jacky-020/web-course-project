
import DataTable from 'react-data-table-component';






interface Column<T> {
  name: string;
  selector: (row: T) => any;
  sortable?: boolean;
}

interface LocationTableProps<T> {
  data: T[];
  columns: Column<T>[];
}

function LocationTable<T>({ data, columns }: LocationTableProps<T>) {


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


  return (
    <div>
      <DataTable
        columns={columns}
        data={data}
        pagination // Enable pagination
        highlightOnHover // Highlight row on hover
        dense
        selectableRows
        persistTableHead={true}
        
      />
    </div>
  );
}

export default LocationTable;
