import React from 'react';
import DataTable from 'react-data-table-component';

const columns = [
  {
    name: 'Title',
    selector: row => row.title,
    sortable: true, // Allow sorting by title
  },
  {
    name: 'Year',
    selector: row => row.year,
    sortable: true, // Allow sorting by year
  },
];

const data = [
  {
    id: 1,
    title: 'Beetlejuice',
    year: '1988',
  },
  {
    id: 2,
    title: 'Ghostbusters',
    year: '1984',
  },
];

function LocationTable() {
  return (
	<div>
		<h2>Location List</h2>
		<div className='input-group ' aria-describedby="addon-wrapping">
			<input
				type="search"
				className="form-control-sm border ps-3"
				placeholder="Search"
			/>
			<button class="btn btn-outline-secondary" type="button" id="button-addon1">search</button>
			<DataTable
				columns={columns}
				data={data}
				pagination // Enable pagination
				highlightOnHover // Highlight row on hover
				dense
			/>
		</div>
	</div>
  );
}

// import React from 'react';
// import DataTable from 'react-data-table-component';
// import Checkbox from '@material-ui/core/Checkbox';

// import ArrowDownward from '@material-ui/icons/ArrowDownward';

// const sortIcon = <ArrowDownward />;
// const selectProps = { indeterminate: isIndeterminate => isIndeterminate };

// function DataTableBase(props) {
// 	return (
// 		<div className='input-group'>

// 		</div>
// 		<DataTable
// 			pagination
// 			selectableRowsComponent={Checkbox}
// 			selectableRowsComponentProps={selectProps}
// 			sortIcon={sortIcon}
// 			dense
// 			{...props}
// 		/>
// 	);
// }



export default LocationTable;