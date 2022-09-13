/* eslint-disable */
import '@babel/polyfill';
import axios from 'axios';
import { showAlert } from './alerts';

let users = {};
export const getSearchedUsers = async (property, val) => {
  try {
    const res = await axios
      .get(`/api/v1/users?${property}=${val}`)
      .then(function(response) {
        users = res.data;
      });

    if (users) {
      // console.log(users.data);
      showAlert('success', 'Data fetched');
    }
  } catch (err) {
    showAlert('error', 'Error retrieving data. Please try again later!');
  }
};

export const updateUser = async (data, id) => {
  try {
    const url = `/api/v1/users/${id}`;

    const res = await axios({
      method: 'PATCH',
      url,
      data
    });

    if (res.data.status === 'success') {
      showAlert('success', ' Details updated successfully!');
    }
  } catch (err) {
    console.error(err);
    showAlert('error', err.response.data.message);
  }
};
