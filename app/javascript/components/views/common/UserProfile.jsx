var UserProfile = (function () {
  var getName = function () {
    return getUser()['name']
  };

  var getId = function () {
    return getUser()['id']
  };

  var getJTI = function () {
    return getUser()['jti']
  };

  var setUser = function (user) {
    localStorage.setItem('user', JSON.stringify(user))
    window.dispatchEvent(new Event("storage"));
  }

  var removeUser = function () {
    localStorage.removeItem('user')
    window.dispatchEvent(new Event("storage"));
  }

  var getUser = function () {
    let userProfile = localStorage.getItem('user') || '{}'

    return JSON.parse(userProfile)
  }

  return {
    getUser,
    getName,
    getId,
    getJTI,
    setUser,
    removeUser,
  }

})();

export default UserProfile;