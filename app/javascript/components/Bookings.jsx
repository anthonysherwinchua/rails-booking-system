import React, { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from 'react-router-dom';
import secureLocalStorage from "react-secure-storage";
import { handleResponse } from './helpers/handleResponse';
import { Authenticate } from "./views/common/Authenticate";
import EventContext from "./views/common/EventContext";
import Confirm from './views/common/Confirm';

const Bookings = () => {
  Authenticate()

  const navigate = useNavigate();
  const eventEmitter = useContext(EventContext);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = () => {
    let url = "/api/v1/bookings?include=room";

    const queryParams = [];
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
            setBookings(r.data)
            eventEmitter.emit("showMessage", { text: 'Bookings succesfully fetched', type: "success" });
          }
        })
      })
      .catch((e) => {
        eventEmitter.emit("showMessage", { text: 'Something went wrong. <br/>Error Message: ' + e, type: "failure" });
      })
  };

  const deleteBooking = (id) => {
    const url = `/api/v1/bookings/${id}`;

    fetch(url, {
      method: "DELETE",
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
            eventEmitter.emit("showMessage", { text: 'Bookings succesfully deleted', type: "success" });
            fetchBookings();
          }
        })
      })
      .catch((e) => {
        eventEmitter.emit("showMessage", { text: 'Something went wrong. <br/>Error Message: ' + e, type: "failure" });
      })
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-9 offset-2">
          <table className="table">
            <thead>
              <tr>
                <th>Room Name</th>
                <th>Start Time</th>
                <th>End Time</th>
                <th></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking, index) => (
                <tr key={index}>
                  <td>{booking.room.name}</td>
                  <td>{booking.start_time}</td>
                  <td>{booking.end_time}</td>
                  <td>
                    <Link to={`/bookings/${booking.id}`} className="btn btn-info mr-2">
                      Show Details
                    </Link>
                  </td>
                  <td>
                    <Link to={`/bookings/${booking.id}/edit`} className="btn btn-primary mr-2">
                      Edit Booking
                    </Link>
                  </td>
                  <td>
                    <Link className="btn btn-danger" data-bs-toggle="modal" data-bs-target="#confirmModalDelete">
                      Delete Booking
                    </Link>
                    <Confirm modalID="confirmModalDelete" title={"Deleting Booking: " + booking.room.name} message="Are you sure?" confirm="Delete!" cancel="No" onConfirm={() => deleteBooking(booking.id)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Bookings;