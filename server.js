const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', err => {
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: './config.env' });
const app = require('./app');

///////////////////////////////////////////////////////////////////////////////////
// DB CONNECTION
///////////////////////////////////////////////////////////////////////////////////
// Local mongoDB connection
// const DB = process.env.DATABASE_LOCAL;

// Hosted mongoDB connection
const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DB_PASSWORD);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(() => console.log('DB connection established...'));

///////////////////////////////////////////////////////////////////////////////////
// console.log(app.get('env'));
// console.log(process.env);

/////////////////////////////////////////////////////////////////////////////////
// 5. START SERVER
/////////////////////////////////////////////////////////////////////////////////
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  //console.log(`App running on port ${port}...`);
});

/////////////////////////////////////////////////////////////////////////////////
process.on('unhandledRejection', err => {
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
