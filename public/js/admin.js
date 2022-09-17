/* eslint-disable */
import '@babel/polyfill';
import axios from 'axios';
import { showAlert } from './alerts';

/////////////////////////////////////////////////////////////////////////////////////////////////////
// USER FUNCTIONS
/////////////////////////////////////////////////////////////////////////////////////////////////////

// SEARCH USER //
///////////////////////////////////////////////////////////////////////
export const getSearchedUsers = async (property, val) => {
  try {
    const table = document.querySelector('.searchUsers-table');
    const tableRow = document.getElementById('table-rows');
    const noResultHeader = document.getElementById('no-result-header');
    const url = `/api/v1/users?${property}=${val}`;
    await fetch(url)
      .then(res => res.json())
      .then(data => {
        if (data.results === 0)
          return (noResultHeader.textContent = 'No results found');

        table.style.display = 'block';
        tableRow.innerHTML = data.data.data
          .map(user => {
            return `             
              <tr>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td><a href='/user-details/${user._id}'>Details</td>
              </tr>`;
          })
          .join('');
      });
  } catch (err) {
    console.log(err);
    showAlert('error', 'Error retrieving data. Please try again later!');
  }
};

// CREATE USER //
///////////////////////////////////////////////////////////////////////
export const createNewUser = async data => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users',
      data: data
    });

    if (res.data.status === 'success') {
      showAlert('success', ' User created successfully!');
      window.setTimeout(() => {
        location.assign('/manage-users', 3000);
      });
    }
  } catch (err) {
    console.error(err);
    showAlert('error', err.response.data.message);
  }
};

// UPDATE USER //
///////////////////////////////////////////////////////////////////////
export const updateUser = async (form, id) => {
  try {
    const url = `/api/v1/users/${id}`;

    const res = await axios({
      method: 'PATCH',
      url,
      data: form
    });

    if (res.data.status === 'success') {
      console.log(res.data);
      showAlert('success', ' Details updated successfully!');
    }
  } catch (err) {
    console.error(err);
    showAlert('error', err.response.data.message);
  }
};

// DELETE USER //
///////////////////////////////////////////////////////////////////////
export const deleteUser = async userId => {
  try {
    const res = await axios({
      method: 'DELETE',
      url: `/api/v1/users/${userId}`
    });

    showAlert('success', ' User deleted successfully!');
    window.setTimeout(() => {
      location.assign('/manage-users', 3000);
    });
  } catch (err) {
    console.error(err);
    showAlert('error', err.response.data.message);
  }
};

/////////////////////////////////////////////////////////////////////////////////////////////////////
// TOUR FUNCTIONS
/////////////////////////////////////////////////////////////////////////////////////////////////////

// SEARCH TOUR //
///////////////////////////////////////////////////////////////////////
export const getSearchedTours = async (property, val) => {
  try {
    const table = document.querySelector('.searchTours-table');
    const tableRow = document.getElementById('table-rows');
    const noResultHeader = document.getElementById('no-result-header');
    const url = `/api/v1/tours?${property}=${val}`;

    await fetch(url)
      .then(res => res.json())
      .then(data => {
        if (data.results === 0)
          return (noResultHeader.textContent = 'No results found');

        table.style.display = 'block';
        tableRow.innerHTML = data.data.data
          .map(tour => {
            return `             
              <tr>
                <td>${tour.name}</td>
                <td>${tour.duration} Days</td>
                <td>$${tour.price}</td>
                <td>${tour.summary}</td>
                <td><a href='/tour-details/${tour.id}'>Details</td>
              </tr>`;
          })
          .join('');
      });
  } catch (err) {
    console.log(err);
    showAlert('error', 'Error retrieving data. Please try again later!');
  }
};

// CREATE TOUR //
///////////////////////////////////////////////////////////////////////
export const createNewTour = async data => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/tours',
      data
    });

    if (res.data.status === 'success') {
      showAlert('success', ' Tour created successfully!');
      window.setTimeout(() => {
        location.assign('/manage-tours', 3000);
      });
    }
  } catch (err) {
    console.error(err);
    showAlert('error', err.response.data.message);
  }
};

// UPDATE TOUR //
///////////////////////////////////////////////////////////////////////
export const updateTour = async (form, id) => {
  try {
    const url = `/api/v1/tours/${id}`;

    await axios({
      method: 'PATCH',
      url,
      data: form
    }).then(res => {
      if (res.data.status === 'success') {
        console.log(res.data);
        showAlert('success', ' Details updated successfully!');
      }
    });
  } catch (err) {
    console.error(err);
    showAlert('error', err.response.data.message);
  }
};

// DELETE TOUR //
///////////////////////////////////////////////////////////////////////
export const deleteTour = async tourId => {
  try {
    const res = await axios({
      method: 'DELETE',
      url: `/api/v1/tours/${tourId}`
    });

    showAlert('success', ' Tour deleted successfully!');
    window.setTimeout(() => {
      location.assign('/manage-tours', 3000);
    });
  } catch (err) {
    console.error(err);
    showAlert('error', err.response.data.message);
  }
};
