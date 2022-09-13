/* eslint-disable */
import { displayMap } from './mapbox';
import { signup } from './signup';
import { forgotPassword, resetPassword } from './forgotPassword';
import { login, logout } from './login';
import { updateSettings } from './updateSettings';
import { bookTour } from './stripe';
import { showAlert } from './alerts';
import { getSearchedUsers, updateUser } from './admin';

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
const manageUserForm = document.querySelector('.form--manageUsers');
const updateUserForm = document.querySelector('.form--updateUser');

// DELEGATION //
///////////////////////////////////////////////////////////////////////
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

///////////////////////////////////////////////////////////////////////
if (manageUserForm)
  manageUserForm.addEventListener('submit', e => {
    e.preventDefault();
    const el = document.getElementById('searchCriteria');
    const property = el.options[el.selectedIndex].value;
    console.log(property);
    const val = document.getElementById('searchValue').value;
    console.log(val);

    getSearchedUsers(property, val);
  });

if (updateUserForm)
  updateUserForm.addEventListener('submit', async e => {
    e.preventDefault();
    const id = document.getElementById('id').value;
    const photo = document.getElementById('photo').files[0]
      ? document.getElementById('photo').files[0].name
      : 'default.jpg';
    const active =
      document.getElementById('active').value === 'Active' ? true : false;

    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('role', document.getElementById('role').value);
    form.append('photo', photo);
    form.append('photo', active);

    await updateUser(form, id);
  });

// if (manageUserForm)
//   manageUserForm.addEventListener('submit', async e => {
//     e.preventDefault();
//     const id = document.getElementById('id').value;
//     const photo = document.getElementById('photo').files[0]
//       ? document.getElementById('photo').files[0].name
//       : 'default.jpg';
//     const name = document.getElementById('name').value;
//     const email = document.getElementById('email').value;
//     const role = document.getElementById('role').value;
//     const active =
//       document.getElementById('active').value === 'Active' ? true : false;

//     console.log(id, photo, name, email, role, active);

//     if (photo === 'default.jpg')
//       await updateUser({ name, email, role, active }, id);
//     else await updateUser({ photo, name, email, role, active }, id);
//   });

///////////////////////////////////////////////////////////////////////
const alertMessage = document.querySelector('body').dataset.alert;
if (alertMessage) showAlert('success', alertMessage, 20);
