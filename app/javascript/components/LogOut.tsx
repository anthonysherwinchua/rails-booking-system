import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import secureLocalStorage from "react-secure-storage";
import { ResponseTypeInterface } from './interfaces/response_type_interface';
import { handleResponse } from './helpers/handleResponse';
import { Authenticate } from "./views/common/Authenticate";
import Confirm from './views/common/Confirm';
import EventContext from "./views/common/EventContext";
import UserProfile from './views/common/UserProfile';

const LogOut = () => {
  Authenticate()

  const navigate = useNavigate();
  const eventEmitter = useContext(EventContext);
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    "Authorization": `${secureLocalStorage.getItem("authorization")}`,
  };

  const logout = () => {
    const url = `/api/logout`;

    fetch(url, {
      method: "DELETE",
      headers: headers,
    })
      .then(res => {
        handleResponse(res as Response, (r: ResponseTypeInterface) => {
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
      <Link to="" className="btn btn-danger" data-bs-toggle="modal" data-bs-target="#confirmModal">
        Logout
      </Link>
      <Confirm modalID="confirmModal" title={"Log out"} message="Are you sure?" confirm="Logout!" cancel="No" onConfirm={logout} />
    </li>
  );
};

export default LogOut;