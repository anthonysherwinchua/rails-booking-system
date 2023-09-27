import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import secureLocalStorage from "react-secure-storage";
import { handleResponse } from './helpers/handleResponse';
import Confirm from './views/common/Confirm';
import UserProfile from './views/common/UserProfile';
import EventContext from "./views/common/EventContext";

const LogOut = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');
  const eventEmitter = useContext(EventContext);

  const logout = () => {
    const url = `/api/logout`;

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
            const errorMessages = r.data.map((message, key) => (
              <Error key={key} message={message} />
            ));
            setErrorMessage(errorMessages);
          } else {

          }
        })
      })
      .catch((e) => {
        setErrorMessage('Something went wrong. <br/>Error Message: ' + e);
      })
      .finally(() => {
        eventEmitter.emit("showMessage", { text: "Success message", type: "success" });
        secureLocalStorage.removeItem("authorization");
        UserProfile.removeUser();
        navigate(`/`);
      });
  };

  return (
    <li className="nav-item">
      <Link className="btn btn-danger" data-bs-toggle="modal" data-bs-target="#confirmModal">
        Logout
      </Link>
      <Confirm modalID="confirmModal" title={"Log out"} message="Are you sure?" confirm="Logout!" cancel="No" onConfirm={logout} />
    </li>
  );
};

export default LogOut;