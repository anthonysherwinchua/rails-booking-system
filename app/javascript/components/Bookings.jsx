import React, { useEffect, useState, useContext } from "react";
import secureLocalStorage from "react-secure-storage";
import { handleResponse } from './helpers/handleResponse';
import EventContext from "./views/common/EventContext";

const Bookings = () => {
  const eventEmitter = useContext(EventContext);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetchBookings(); // Fetch all rooms on component mount
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
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking, index) => (
                <tr key={index}>
                  <td>{booking.room.name}</td>
                  <td>{booking.start_time}</td>
                  <td>{booking.end_time}</td>
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