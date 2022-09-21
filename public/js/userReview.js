/* eslint-disable */
import '@babel/polyfill';
import axios from 'axios';
import { showAlert } from './alerts';

export const createReview = async form => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/reviews',
      data: form
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Thanks you!');
    }
  } catch (err) {
    console.log(err);
    showAlert('error', 'Error updating review. Please try again later!');
  }
};
