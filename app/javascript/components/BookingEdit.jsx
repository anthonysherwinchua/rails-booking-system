import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import secureLocalStorage from "react-secure-storage";
import { handleResponse } from './helpers/handleResponse';
import { Authenticate } from "./views/common/Authenticate";
import EventContext from "./views/common/EventContext";

const BookingEdit = () => {
  Authenticate()

  const navigate = useNavigate();
  const eventEmitter = useContext(EventContext);
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

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
            setStartTime(r.data.start_time)
            setEndTime(r.data.end_time)
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

  const onChange = (event, setFunction) => {
    setFunction(event.target.value);
  };

  const onSubmit = (event) => {
    event.preventDefault();

    const body = {
      booking: {
        start_time: startTime,
        end_time: endTime,
      }
    };

    fetch(`/api/v1/bookings/${id}`, {
      method: "PUT",
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
            eventEmitter.emit("showMessage", { text: 'Booking succesfully updated', type: "success" });
          }
        })
      })
      .catch((e) => {
        eventEmitter.emit("showMessage", { text: 'Something went wrong. <br/>Error Message: ' + e, type: "failure" });
      })
  }

  function formatDateTime(date) {
    date = new Date(date)
    const formattedDateTime = date.toISOString().slice(0, 16);

    return formattedDateTime;
  }


  return (
    <div className="container">
      <div className="row">
        <div className="col-md-8 offset-md-2">
          <div className="card">
            <div className="card-header">Edit Booking Details</div>
            <div className="card-body">
              <form onSubmit={onSubmit}>
                <table className="table">
                  <tbody>
                    <tr>
                      <th>Start Time</th>
                      <td>
                        <input
                          name="start_time"
                          id="start_time"
                          type="datetime-local"
                          className="form-control"
                          defaultValue={formatDateTime(startTime)}
                          required
                          onChange={(event) => onChange(event, setStartTime)}
                        />
                      </td>
                    </tr>
                    <tr>
                      <th>End Time</th>
                      <td>
                        <input
                          name="end_time"
                          id="end_time"
                          type="datetime-local"
                          className="form-control"
                          value={formatDateTime(endTime)}

                          required
                          onChange={(event) => onChange(event, setEndTime)}
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                  <button onClick={() => navigate(-1)} className="btn btn-outline-secondary">
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary col-3">
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div >
    </div >
  );
};

export default BookingEdit;