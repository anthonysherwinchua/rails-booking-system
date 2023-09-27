import React, { useEffect, useState, useContext } from "react";
import secureLocalStorage from "react-secure-storage";
import { handleResponse } from './helpers/handleResponse';
import EventContext from "./views/common/EventContext";

const Rooms = () => {
  const eventEmitter = useContext(EventContext);
  const [rooms, setRooms] = useState([]);
  const [capacities, setCapacities] = useState([]);
  const [availableTags, setAvailableavailableTags] = useState([]);

  const [capacity, setCapacity] = useState("");
  const [tags, setTags] = useState("");

  useEffect(() => {
    fetchRooms(); // Fetch all rooms on component mount
  }, []);

  const fetchRooms = () => {
    let url = "/api/rooms";

    const queryParams = [];
    if (capacity !== "") {
      queryParams.push(`capacity=${encodeURIComponent(capacity)}`);
    }
    if (tags.length > 0) {
      tags.forEach((tag) => {
        queryParams.push(`tags[]=${encodeURIComponent(tag)}`);
      });
    }
    const queryString = queryParams.join("&");
    if (queryString) {
      url += `?${queryString}`;
    }

    fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": secureLocalStorage.getItem("authorization"),
      },
    })
      .then(res => {
        handleResponse(res, (r) => {
          if (r.status == 'error') {
            eventEmitter.emit("showMessage", { text: JSON.parse(r.data)['message'], type: "failure" });
          } else {
            if (capacities.length < 1) {
              setCapacities(r.data.map((room) => room.capacity).sort((a, b) => a - b))
            }
            if (availableTags.length < 1) {
              setAvailableavailableTags(
                [...new Set(r.data.reduce((availableTags, room) => {
                  return availableTags.concat(room.tags);
                }, []))].sort()
              )
            }
            setRooms(r.data)
            eventEmitter.emit("showMessage", { text: 'Rooms succesfully fetched', type: "success" });
          }
        })
      })
      .catch((e) => {
        eventEmitter.emit("showMessage", { text: 'Something went wrong. <br/>Error Message: ' + e, type: "failure" });
      })
  };

  const handleTagChange = (e, tag) => {
    const isChecked = e.target.checked;
    if (isChecked) {
      setTags([...tags, tag]);
    } else {
      setTags(tags.filter((selectedTag) => selectedTag !== tag));
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    fetchRooms();
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-3">
          <form onSubmit={handleFormSubmit}>
            <div className="mb-3">
              <label className="form-label">Minimum Pax:</label>
              <select
                className="form-select"
                id="capacity"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
              >
                <option value="">Select Minimum Pax</option>
                {capacities.map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">Tags:</label>
              <div>
                {availableTags.map((tag) => (
                  <div key={tag} className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id={tag}
                      value={tag}
                      checked={tags.includes(tag)}
                      onChange={(e) => handleTagChange(e, tag)}
                    />
                    <label className="form-check-label" htmlFor={tag}>
                      {tag}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            <button type="submit" className="btn btn-primary">Filter Rooms</button>
          </form>
        </div>
        <div className="col-md-9">
          <table className="table">
            <thead>
              <tr>
                <th>Room Name</th>
                <th>Capacity</th>
                <th>availableTags</th>
              </tr>
            </thead>
            <tbody>
              {rooms.map((room, index) => (
                <tr key={index}>
                  <td>{room.name}</td>
                  <td>{room.capacity}</td>
                  <td>{room.tags.join(', ')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Rooms;