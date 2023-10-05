import React, { useState, useContext, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import secureLocalStorage from "react-secure-storage";
import { handleResponse } from './helpers/handleResponse';
import { ResponseTypeInterface } from './interfaces/response_type_interface';
import UserProfile from './views/common/UserProfile';
import EventContext from "./views/common/EventContext";

const SignUp = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const eventEmitter = useContext(EventContext);
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  const onChange = (event: ChangeEvent<HTMLInputElement>, setFunction: (value: string) => void): void => {
    setFunction(event.target.value);
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const url = "/api/signup";

    if (name.length == 0 || email.length == 0 || password.length == 0 || passwordConfirmation.length == 0 || password.length != passwordConfirmation.length)
      return;

    const body = {
      user: {
        name,
        email,
        password,
        password_confirmation: passwordConfirmation,
      }
    };

    document.querySelectorAll('.is-invalid').forEach(function (input) {
      input.classList.remove('is-invalid');
    })

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
      .then(res => {
        handleResponse(res as Response, (r: ResponseTypeInterface) => {
          if (r.status == 'error') {
            const data = JSON.parse(r.data)
            let errorMessages: string[] = [];
            Object.keys(data).forEach(function (key) {
              errorMessages.push(key + " " + data[key]);
              const inputField = document.getElementById(key);
              if (inputField !== null) {
                inputField.classList.add('is-invalid');
              }
            })
            eventEmitter.emit("showMessage", { text: errorMessages.join("<br/>"), type: "failure" });
          } else {
            eventEmitter.emit("showMessage", { text: r.data['message'], type: "success" });
            const authorizationHeader = res.headers.get("Authorization");

            if (authorizationHeader !== null) {
              secureLocalStorage.setItem("authorization", authorizationHeader);
            }
            UserProfile.setUser(JSON.parse(r.data['user']))
            navigate(`/`);
          }
        })
      })
      .catch((e) => {
        eventEmitter.emit("showMessage", { text: 'Something went wrong. <br/>Error Message: ' + e, type: "failure" });
      });
  };

  return (
    <>
      <section className="jumbotron jumbotron-fluid text-center">
        <div className="container">
          <h1 className="display-4">Sign Up Page</h1>
        </div>
      </section>
      <div>
        <main className="container">
          <div className="row justify-content-center">
            <div className="col-md-6">
              <form onSubmit={onSubmit}>
                <div className="form-group">
                  <label htmlFor="name">name</label>
                  <input type="text" name="name" id="name" className="form-control" required onChange={(event) => onChange(event, setName)} />
                </div>
                <div className="form-group">
                  <label htmlFor="name">email</label>
                  <input type="text" name="email" id="email" className="form-control" required onChange={(event) => onChange(event, setEmail)} />
                </div>
                <div className="form-group">
                  <label htmlFor="name">password</label>
                  <input type="password" name="password" id="password" className="form-control" required onChange={(event) => onChange(event, setPassword)} />
                </div>
                <div className="form-group">
                  <label htmlFor="name">confirm password</label>
                  <input type="password" name="password_confirmation" id="password_confirmation" className="form-control" required onChange={(event) => onChange(event, setPasswordConfirmation)} />
                </div>
                <button type="submit" className="btn btn-primary mt-3">
                  Sign Up
                </button>
              </form>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default SignUp;