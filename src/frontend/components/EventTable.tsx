
import { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { Event, fetchEvents } from './FetchEvents';
import { HandThumbsUp } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';

function EventTable() {
  const [likedEvents, setLikedEvents] = useState<number[]>([]);
  const [data, setData] = useState<Event[]>([]);
  const navigate = useNavigate();

  const columns = [
    {
      name: 'id',
      sortable: true,
      cell: (row: Event) => (
        <a href="#" onClick={() => navigate(`/event/${row.id}`)}>
          {row.id}
        </a>
      ),
      width: "4rem" 
    },
    {
      name: 'title',
      selector: (row: Event) => row.title,
      wrap: true,
      sortable: true,
    },
    {
      name: 'date',
      selector: (row: Event) => new Date(row.date).toLocaleString(),
      wrap: true,
      width: "10rem"
    },
    {
      name: 'description',
      selector: (row: Event) => row.description,
      wrap: true,
      width: "30rem" 
    },
    {
      name: 'presentar',
      selector: (row: Event) => row.presentar,
      wrap: true,
      sortable: true,
    },
    {
      name: 'price',
      selector: (row: Event) => row.price?.toFixed(2), // Format the price
      sortable: true,
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
    }
    getEvent();
  }, []);

  return (
    <div className='m-1'>
      <DataTable
        columns={columns}
        data={data}
        pagination 
        highlightOnHover 
        dense
        persistTableHead={true}
      />
    </div>
  );
}

export default EventTable;