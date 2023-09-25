import React from "react";
import UserProfile from './views/common/UserProfile';

const Profile = () => {
  const user = UserProfile.getUser();

  return (
    <>
      <div className="row justify-content-center">
        <div className="col-md-6 justify-content-center">
          <table className="table table-bordered">
            <tbody>
              <tr>
                <td>ID</td>
                <td>{user.id}</td>
              </tr>
              <tr>
                <td>Name</td>
                <td>{user.name}</td>
              </tr>
              <tr>
                <td>Email</td>
                <td>{user.email}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Profile;