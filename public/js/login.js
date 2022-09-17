/* eslint-disable */
import '@babel/polyfill';
import axios from 'axios';
import { showAlert } from './alerts';

// LOGIN //
export const login = async (email, password) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/login',
      data: {
        email,
        password
      }
    });

    if (res.data.status === 'success') {
      showAlert('success', 'logged in successfully');
      window.setTimeout(() => {
        location.assign('/', 1500);
      });
    }
    // console.log(res);
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

// LOGOUT //
export const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: '/api/v1/users/logout'
    });
    if (res.data.status === 'success') {
      showAlert('success', 'logged out!');
      window.setTimeout(() => {
        location.assign('/', 1500);
      });
    }
  } catch (err) {
    showAlert('error', 'Error logging out! Try again.');
  }
};
