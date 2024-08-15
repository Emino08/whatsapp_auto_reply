// let express = require('express');
// let app = express()
// let port = 3000 || process.env.PORT;
//
// // Middleware
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
//
// // Routes
// app.use('/whatsapp', require('./routes/whatsapp-auto-reply'));
//
// // Start the server
// app.listen(port, () => {
//   console.log('Server running on port 5000');
// });
//
// // Error handling
// app.use(function (req, res, next) {
//   res.status(404).send('Not Found');
// });
//
// app.use(function (err, req, res, next) {
//   console.error(err.stack);
//   res.status(500).send('Server Error');
// });
//
// module.exports = app;
const express = require('express');
const app = express();
const whatsappRouter = require('./routes/whatsapp-auto-reply');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use('/whatsapp', whatsappRouter);

// Set the port, default to 3002 if not specified in environment
const PORT = process.env.PORT || 3002;

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

