import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import secureLocalStorage from "react-secure-storage";
import { handleResponse } from './helpers/handleResponse';
import { Authenticate } from "./views/common/Authenticate";
import EventContext from "./views/common/EventContext";

const BookingDetails = () => {
  Authenticate()

  const navigate = useNavigate();
  const eventEmitter = useContext(EventContext);
  const { id } = useParams();
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    fetch(`/api/v1/bookings/${id}`, {
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
            setBooking(r.data)
            eventEmitter.emit("showMessage", { text: 'Booking succesfully fetched', type: "success" });
          }
        })
      })
      .catch((e) => {
        eventEmitter.emit("showMessage", { text: 'Something went wrong. <br/>Error Message: ' + e, type: "failure" });
      })
  }, [id]);

  if (!booking) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-8 offset-md-2">
          <div className="card">
            <div className="card-header">Booking Details</div>
            <div className="card-body">
              <table className="table">
                <tbody>
                  <tr>
                    <th>Room Name</th>
                    <td>{booking.room.name}</td>
                  </tr>
                  <tr>
                    <th>Start Time</th>
                    <td>{booking.start_time}</td>
                  </tr>
                  <tr>
                    <th>End Time</th>
                    <td>{booking.end_time}</td>
                  </tr>
                  <tr>
                    <th>Maximum Capacity</th>
                    <td>{booking.room.capacity}</td>
                  </tr>
                  <tr>
                    <th>Tags</th>
                    <td>{booking.room.tags.join(', ')}</td>
                  </tr>
                </tbody>
              </table>

              <button onClick={() => navigate(-1)} className="btn btn-primary">
                Back
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetails;