import { useEffect, useState } from 'react';
import axios from "axios"
// import { format } from "date-fns";

import './App.css';

const baseUrl = "http://localhost:5000"

function App() {
  const [description, setDescription] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [eventsList, setEventsList] = useState([]);
  const [eventId, setEventId] = useState(null);

  const fetchEvents = async () => {
    const data = await axios.get(`${baseUrl}/events`)
    const { events } = data.data
    setEventsList(events);
  }

  const handleChange = (e, field) => {
    if (field == 'edit') {
      setEditDescription(e.target.value)
    } else {
      setDescription(e.target.value)
    }
  }

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${baseUrl}/events/${id}`)
      const updatedList = eventsList.filter(event => event.id != id);
      setEventsList(updatedList)
    } catch (err) {
      console.error(err.message)
    }
  }

  const handleEdit = (event) => {
    setEventId(event.id);
    setEditDescription(event.description);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await axios.post(`${baseUrl}/events`, { description })
      setEventsList([...eventsList, data.data]);
      setDescription('');
    } catch (err) {
      console.error(err.message);
    }
  }

  useEffect(() => {
    fetchEvents();
  }, [])

  return (
    <div className="App">
      <section>
        <form onSubmit={handleSubmit}>
          <label htmlFor='description'>Description</label>
          <input
            onChange={(r) => handleChange(e, 'description')}
            type='text'
            name='description'
            id='description'
            placeholder='Describe the event'
            value={description}
          />
          <button type='submit'>Submit</button>
        </form>
      </section>
      <section>
        <ul>
          {eventsList.map(event => {
            if (eventId == event.id) {
              return (
                <li><form onSubmit={handleSubmit} key={event.id}>
                <input
                  onChange={(r) => handleChange(e, 'edit')}
                  type='text'
                  name='editDescription'
                  id='editDescription'
                  value={editDescription}
                />
                <button type='submit'>Submit</button>
              </form></li>
              )
            } else {
              return (
                <li style={{ display: "flex" }} key={event.id}>
                  {event.description}
                  <button onClick={() => handleEdit(event)}>Edit</button>
                  <button onClick={() => handleDelete(event.id)}>X</button>
                </li>
              )
            }
          })}
        </ul>
      </section>
    </div>
  );
}

export default App;
