/* eslint-disable */
import { displayMap } from './mapbox';
import { signup } from './signup';
import { forgotPassword, resetPassword } from './forgotPassword';
import { login, logout } from './login';
import { updateSettings } from './updateSettings';
import { bookTour } from './stripe';
import { showAlert } from './alerts';
import {
  getSearchedUsers,
  getSearchedTours,
  createNewUser,
  createNewTour,
  updateUser,
  updateTour,
  deleteUser,
  deleteTour
} from './admin';

// DOM ELEMENTS //
const mapBox = document.getElementById('map');
const signupForm = document.querySelector('.form--signup');
const loginForm = document.querySelector('.form--login');
const logOutBtn = document.querySelector('.nav__el--logout');
const forgotPasswordForm = document.querySelector('.form--forgotPassword');
const resetPasswordForm = document.querySelector('.form--resetPassword');
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');
const bookBtn = document.getElementById('book-tour');

const searchUserBtn = document.getElementById('search-user-btn');
const searchUserForm = document.querySelector('.form--searchUsers');
const createUserForm = document.querySelector('.createUser-form');
const updateUserBtn = document.getElementById('update-user-btn');
const deleteUserBtn = document.getElementById('delete-user-btn');

const searchTourBtn = document.getElementById('search-tour-btn');
const searchTourForm = document.querySelector('.form--searchTours');
const createTourForm = document.querySelector('.createTour-form');
const updateTourBtn = document.getElementById('update-tour-btn');
const deleteTourBtn = document.getElementById('delete-tour-btn');

/////////////////////////////////////////////////////////////////////////////////////////////////////
// REUSABLE FUNCTIONS
/////////////////////////////////////////////////////////////////////////////////////////////////////
const searchUserFn = async e => {
  e.preventDefault();
  const el = document.getElementById('searchCriteria');
  const property = el.options[el.selectedIndex].value;
  console.log(property);
  const val = document.getElementById('searchValue').value;
  console.log(val);

  await getSearchedUsers(property, val);
};

const searchTourFn = async e => {
  e.preventDefault();
  const el = document.getElementById('searchCriteria');
  const property = el.options[el.selectedIndex].value;
  console.log(property);
  const val = document.getElementById('searchValue').value;
  console.log(val);

  await getSearchedTours(property, val);
};
//////////////////////////////////////////////////////////////////////////

const deleteUserFn = async e => {
  e.preventDefault();
  const Id = document.getElementById('id').value;
  await deleteUser(Id);
};

const deleteTourFn = async e => {
  e.preventDefault();
  const Id = document.getElementById('id').value;
  await deleteTour(Id);
};

/////////////////////////////////////////////////////////////////////////////////////////////////////
// DELEGATION //
/////////////////////////////////////////////////////////////////////////////////////////////////////
if (mapBox) {
  const locations = JSON.parse(mapBox.dataset.locations);
  displayMap(locations);
}

///////////////////////////////////////////////////////////////////////
if (signupForm) {
  signupForm.addEventListener('submit', e => {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('passwordConfirm').value;

    e.preventDefault();
    signup(name, email, password, passwordConfirm);
  });
}

///////////////////////////////////////////////////////////////////////
if (loginForm) {
  loginForm.addEventListener('submit', e => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    e.preventDefault();
    login(email, password);
  });
}

///////////////////////////////////////////////////////////////////////
if (logOutBtn) {
  logOutBtn.addEventListener('click', logout);
}

///////////////////////////////////////////////////////////////////////
if (forgotPasswordForm) {
  forgotPasswordForm.addEventListener('submit', e => {
    const email = document.getElementById('email').value;

    e.preventDefault();
    forgotPassword(email);
    email = '';
  });
}

///////////////////////////////////////////////////////////////////////
if (resetPasswordForm) {
  resetPasswordForm.addEventListener('submit', e => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const token = urlParams.get('resetToken');
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('passwordConfirm').value;

    e.preventDefault();
    resetPassword(token, password, passwordConfirm);
  });
}

///////////////////////////////////////////////////////////////////////
if (userDataForm) {
  userDataForm.addEventListener('submit', e => {
    e.preventDefault();
    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('photo', document.getElementById('photo').files[0]);

    updateSettings(form, 'data');
  });
}

///////////////////////////////////////////////////////////////////////
if (userPasswordForm) {
  userPasswordForm.addEventListener('submit', async e => {
    document.querySelector('.btn--save-password').textContent = 'Updating...';
    e.preventDefault();
    const passwordCurrent = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;
    await updateSettings(
      { passwordCurrent, password, passwordConfirm },
      'password'
    );
    document.querySelector('.btn--save-password').textContent = 'Save password';

    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
  });
}

///////////////////////////////////////////////////////////////////////
if (bookBtn)
  bookBtn.addEventListener('click', e => {
    e.target.textContent = 'Processing...';
    const { tourId } = e.target.dataset;
    bookTour(tourId);
  });

/////////////////////////////////////////////////////////////////////////////////////////////////////
// MANAGE USERS
/////////////////////////////////////////////////////////////////////////////////////////////////////

// SEARCH USER //
//////////////////////////////////////////////////////////////////////////
if (searchUserBtn) searchUserBtn.addEventListener('click', searchUserFn);
if (searchUserForm) searchUserForm.addEventListener('submit', searchUserFn);

// CREATE USER //
///////////////////////////////////////////////////////////////////////
if (createUserForm)
  createUserForm.addEventListener('submit', async e => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const role = document.getElementById('role').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('passwordConfirm').value;

    // const form = new FormData();
    // form.append('name', name);
    // form.append('email', email);
    // // form.append('role', role);
    // form.append('password', password);
    // form.append('passwordConfirm', passwordConfirm);

    const form = {
      name: name,
      email: email,
      role: role,
      password: password,
      passwordConfirm: passwordConfirm
    };

    console.log(name, email, role, password, passwordConfirm);

    await createNewUser(form);
    e.target.reset();
    return false;
  });

// UPDATE USER //
//////////////////////////////////////////////////////////////////////////
if (updateUserBtn)
  updateUserBtn.addEventListener('click', async e => {
    e.preventDefault();
    const id = document.getElementById('id').value;
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const role = document.getElementById('role').value;
    const photo = document.getElementById('photo').files[0]
      ? document.getElementById('photo').files[0].name
      : 'default.jpg';
    const active =
      document.getElementById('active').value === 'Active' ? true : false;

    const form = {
      name: name,
      email: email,
      role: role,
      photo: photo,
      active: active
    };

    await updateUser(form, id);
  });

// DELETE USER //
//////////////////////////////////////////////////////////////////////////
if (deleteUserBtn) deleteUserBtn.addEventListener('click', deleteUserFn);

/////////////////////////////////////////////////////////////////////////////////////////////////////
// MANAGE TOURS
/////////////////////////////////////////////////////////////////////////////////////////////////////

// SEARCH TOURS //
//////////////////////////////////////////////////////////////////////////
if (searchTourBtn) searchTourBtn.addEventListener('click', searchTourFn);
if (searchTourForm) searchTourForm.addEventListener('submit', searchTourFn);

// CREATE TOUR //
//////////////////////////////////////////////////////////////////////////
if (createTourForm)
  createTourForm.addEventListener('submit', async e => {
    e.preventDefault();

    const imageCover = document.getElementById('photo').files[0]
      ? document.getElementById('photo').files[0]
      : 'tour-1-cover.jpg';

    const name = document.getElementById('name').value;
    const summary = document.getElementById('summary').value;
    const description = document.getElementById('description').value;
    const duration = document.getElementById('duration').value;
    const price = document.getElementById('price').value;
    const maxGroupSize = document.getElementById('maxGroupSize').value;
    const difficulty = document.getElementById('difficulty').value;
    const guides = document.getElementById('guides').value;
    const startDates = document.getElementById('startDates').value;

    const startLocationType = document.getElementById('startLocationType')
      .value;
    const startLocationDesc = document.getElementById('startLocationDesc')
      .value;
    const startLocationAddr = document.getElementById('startLocationAddr')
      .value;
    const startLocationCoordEl = document.getElementById('startLocationCoord')
      .value;
    const startLocLatLng = startLocationCoordEl.split(',');

    const locationsType = document.getElementById('locationsType').value;
    const locationsDesc = document.getElementById('locationsDesc').value;
    const locationsDay = document.getElementById('locationsDay').value;
    const locationsCoordEl = document.getElementById('locationsCoord').value;
    const locLatLng = locationsCoordEl.split(',');

    const form = {
      startLocation: {
        description: startLocationDesc,
        type: startLocationType,
        coordinates: [startLocLatLng[0] * 1, startLocLatLng[1] * 1],
        address: startLocationAddr
      },
      startDates: [startDates],
      name: name,
      duration: duration * 1,
      maxGroupSize: maxGroupSize * 1,
      difficulty: difficulty,
      guides: [guides],
      price: price * 1,
      summary: summary,
      description: description,
      imageCover: imageCover,
      locations: [
        {
          description: locationsDesc,
          type: locationsType,
          coordinates: [locLatLng[0] * 1, locLatLng[1] * 1],
          day: locationsDay * 1
        }
      ]
    };

    console.log(form);
    await createNewTour(form);
    e.target.reset();
    return false;
  });

// UPDATE TOUR //
//////////////////////////////////////////////////////////////////////////
if (updateTourBtn)
  updateTourBtn.addEventListener('click', async e => {
    e.preventDefault();

    const imageCover = document.getElementById('photo').files[0];
    // ? document.getElementById('photo').files[0]
    // : 'tour-1-cover.jpg';

    const id = document.getElementById('id').value;
    const name = document.getElementById('name').value;
    const summary = document.getElementById('summary').value;
    const description = document.getElementById('description').value;
    const duration = document.getElementById('duration').value.split(' ')[0];
    const price = document.getElementById('price').value.split('$')[1];
    const maxGroupSize = document.getElementById('maxGroupSize').value;
    const difficulty = document.getElementById('difficulty').value;
    const guides = document.getElementById('guides').value;
    const startDates = document.getElementById('startDates').value;

    const startLocation0 = document
      .getElementById('startLocation-0')
      .value.split('|');
    const startLocation1 = document
      .getElementById('startLocation-1')
      .value.split('|');

    const startLocationType = startLocation0[0];
    const startLocationCoord = startLocation0[1];
    const startLocationDesc = startLocation1[0];
    const startLocationAddr = startLocation1[1];

    const startLocLatLng = startLocationCoord.split(',');

    const locations = document.getElementById('locations').value.split('|');

    const locationsType = locations[0];
    const locationsCoord = locations[1];
    const locationsDesc = locations[2];
    const locationsDay = locations[3];
    const locLatLng = locationsCoord.split(',');

    const form = {
      startLocation: {
        description: startLocationDesc,
        type: startLocationType,
        coordinates: [startLocLatLng[0] * 1, startLocLatLng[1] * 1],
        address: startLocationAddr
      },
      startDates: [startDates],
      name: name,
      duration: duration * 1,
      maxGroupSize: maxGroupSize * 1,
      difficulty: difficulty,
      guides: [guides],
      price: price * 1,
      summary: summary,
      description: description,
      // imageCover: dataForm,
      locations: [
        {
          description: locationsDesc,
          type: locationsType,
          coordinates: [locLatLng[0] * 1, locLatLng[1] * 1],
          day: locationsDay * 1
        }
      ]
    };

    const formData = new FormData();
    formData.append('obj', JSON.stringify(form));
    formData.append('imageCover', JSON.stringify(imageCover));

    console.log(form);
    await updateTour(formData, id);
  });

// DELETE TOUR //
//////////////////////////////////////////////////////////////////////////
if (deleteTourBtn) deleteTourBtn.addEventListener('click', deleteTourFn);

///////////////////////////////////////////////////////////////////////
const alertMessage = document.querySelector('body').dataset.alert;
if (alertMessage) showAlert('success', alertMessage, 20);
