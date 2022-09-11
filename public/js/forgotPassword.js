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
        location.assign('/', 3000);
      });
    }
    // console.log(res);
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

// RESET PASSWORD //
export const resetPassword = async (token, password, passwordConfirm) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: `/api/v1/users/resetPassword/${token}`,
      data: {
        password,
        passwordConfirm
      }
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Password updated successfully!');
      window.setTimeout(() => {
        location.assign('/', 3000);
      });
    }
    // console.log(res);
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
