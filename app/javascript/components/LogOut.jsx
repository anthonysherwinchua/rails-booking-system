import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import secureLocalStorage from "react-secure-storage";
import { handleResponse } from './helpers/handleResponse';
import Confirm from './views/common/Confirm';
import EventContext from "./views/common/EventContext";
import UserProfile from './views/common/UserProfile';

const LogOut = () => {
  const navigate = useNavigate();
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
            eventEmitter.emit("showMessage", { text: JSON.parse(r.data)['message'], type: "failure" });
          } else {
            eventEmitter.emit("showMessage", { text: r.data['message'], type: "success" });
          }
        })
      })
      .catch((e) => {
        eventEmitter.emit("showMessage", { text: 'Something went wrong. <br/>Error Message: ' + e, type: "failure" });
      })
      .finally(() => {
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