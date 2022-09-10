/* eslint-disable */
import '@babel/polyfill';
import axios from 'axios';
import { showAlert } from './alerts';

// FORGOT PASSWORD //
export const forgotPassword = async email => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/forgotPassword',
      data: {
        email
      }
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Password reset link sent to registered email!');
      window.setTimeout(() => {
        location.assign('/', 5000);
      });
    }
    // console.log(res);
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
