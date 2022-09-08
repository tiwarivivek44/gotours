/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

export const bookTour = async tourId => {
  try {
    const stripe = Stripe(
      'pk_test_51LfRoGSBv3gkrL92i8SQzWevZQ8Rgloq5wOUSnGnoNW3coUkbdli4Apy5PMshbKJ3MCX5NzcS7ue6s9ZfS29jYeK00CyKMhNys'
    );
    // 1) Get checkout session from endpoint/API
    const session = await axios(
      `http://127.0.0.1:3000/api/v1/bookings/checkout-session/${tourId}`
    );

    console.log(session);

    // 2) Create the checkout form + charge credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id
    });
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};
