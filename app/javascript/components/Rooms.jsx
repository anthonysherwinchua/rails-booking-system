import React, { useEffect, useState, useContext } from "react";
import secureLocalStorage from "react-secure-storage";
import { handleResponse } from './helpers/handleResponse';
import EventContext from "./views/common/EventContext";
import Confirm from './views/common/Confirm';

const Rooms = () => {
  const eventEmitter = useContext(EventContext);
  const [rooms, setRooms] = useState([]);
  const [capacities, setCapacities] = useState([]);
  const [availableTags, setAvailableavailableTags] = useState([]);

  const [capacity, setCapacity] = useState("");
  const [tags, setTags] = useState("");
  const [bookingStartTime, setBookingStartTime] = useState("");
  const [bookingEndTime, setBookingEndTime] = useState("");
  const [selectedRoomId, setSelectedRoomId] = useState(null);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = () => {
    let url = "/api/v1/rooms";

    const queryParams = [];
    if (capacity !== "") {
      queryParams.push(`capacity=${encodeURIComponent(capacity)}`);
    }
    if (tags.length > 0) {
      tags.forEach((tag) => {
        queryParams.push(`tags[]=${encodeURIComponent(tag)}`);
      });
    }
    if (bookingStartTime !== "") {
      queryParams.push(`start_time=${encodeURIComponent(bookingStartTime)}`);
    }
    if (bookingEndTime !== "") {
      queryParams.push(`end_time=${encodeURIComponent(bookingEndTime)}`);
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

  const bookRoom = () => {
    const url = `/api/v1/bookings/`;

    const body = {
      booking: {
        start_time: bookingStartTime,
        end_time: bookingEndTime,
        room_id: selectedRoomId,
      }
    };

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": secureLocalStorage.getItem("authorization"),
      },
      body: JSON.stringify(body),
    })
      .then(res => {
        handleResponse(res, (r) => {
          if (r.status == 'error') {
            let data = JSON.parse(r.data)
            let errorMessages = [];
            Object.keys(data).forEach(function (key) {
              const keyMessage = key.replace(/_/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
              let message = keyMessage + " " + data[key];
              if (key == 'base') { message = data[key] }
              errorMessages.push(message);
              const inputField = document.getElementById(key);
              if (inputField) {
                inputField.classList.add('is-invalid');
              }
            })
            eventEmitter.emit("showMessage", { text: errorMessages.join("<br/>"), type: "failure" });
          } else {
            eventEmitter.emit("showMessage", { text: 'Bookings successfully created', type: "success" });
            fetchRooms();
          }
        })
      })
      .catch((e) => {
        eventEmitter.emit("showMessage", { text: 'Something went wrong. <br/>Error Message: ' + e, type: "failure" });
      });
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-3">
          <form onSubmit={handleFormSubmit}>
            <div className="mb-3">
              <label className="form-label">Booking Start Time:</label>
              <input
                type="datetime-local"
                className="form-control"
                value={bookingStartTime}
                onChange={(e) => setBookingStartTime(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Booking End Time:</label>
              <input
                type="datetime-local"
                className="form-control"
                value={bookingEndTime}
                onChange={(e) => setBookingEndTime(e.target.value)}
              />
            </div>
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
          <table className="table table-hover">
            <thead>
              <tr>
                <th>Room Name</th>
                <th>Capacity</th>
                <th>availableTags</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {rooms.map((room, index) => (
                <tr key={index}>
                  <td>{room.name}</td>
                  <td>{room.capacity}</td>
                  <td>{room.tags.join(', ')}</td>
                  <td>
                    <button
                      className="btn btn-primary"
                      data-bs-toggle="modal"
                      data-bs-target="#confirmModalBooking"
                      onClick={() => setSelectedRoomId(room.id)}
                      disabled={!bookingStartTime || !bookingEndTime}
                    >
                      Book
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Confirm
        modalID="confirmModalBooking"
        title={"Book this room"}
        message="Are you sure?"
        confirm="Book!"
        cancel="No"
        onConfirm={bookRoom}
      />
    </div >
  );
};

export default Rooms;