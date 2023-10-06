import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UserProfile from './UserProfile';

export function Authenticate() {
  const navigate = useNavigate();
  const user = UserProfile.getUser();

  useEffect(() => {
    if (user.authenticated === false) {
      navigate('/login')
    } else {
      console.log('do nothing? ')
    }
  }, []);

  return (<></>);
};