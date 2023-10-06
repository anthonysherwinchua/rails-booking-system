import { UserInterface } from '../../interfaces/user_interface';

var UserProfile = (function () {
  var getName = function (): string | undefined {
    return getUser()['name']
  };

  var getId = function (): string | undefined {
    return getUser()['id']
  };

  var getJTI = function (): string | undefined {
    return getUser()['jti']
  };

  var setUser = function (user: UserInterface): void {
    user['authenticated'] = true
    localStorage.setItem('user', JSON.stringify(user))
    window.dispatchEvent(new Event("storage"));
  }

  var removeUser = function (): void {
    localStorage.removeItem('user')
    window.dispatchEvent(new Event("storage"));
  }

  var getUser = function () {
    const userProfile = localStorage.getItem('user') || '{ "authenticated": false }'

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