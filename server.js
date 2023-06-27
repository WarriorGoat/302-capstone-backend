require("dotenv").config();

// const createError = require("http-errors");
const express = require("express");
const path = require("path");
const { logger } = require("./middleware/logger");
const { errorHandler } = require("./middleware/errorHandler");
const cookieParser = require("cookie-parser");
const cors = require("cors");
// const corsOptions = require("./config/corsOptions");
const app = express();
app.use(logger);
// app.use(cors(corsOptions));

//assign port
const PORT = process.env.PORT || 5000;

//register routes
const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const entriesRouter = require("./routes/entries");

//connect through mongoose
const { mongooseConnect } = require("./mongoose");
mongooseConnect();
const mongoose = require("mongoose");

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

//allow access to static files
app.use(express.static(path.join(__dirname, "public")));

//enable CORS
app.use(cors());
app.options("*", cors());
//register routes
app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/entries", entriesRouter);

// catch 404 and forward to 404 error page
app.all('*', (req, res) => {
  res.status(404)
  if (req.accepts('html')) {
      res.sendFile(path.join(__dirname, 'views', '404.html'))
  } else if (req.accepts('json')) {
      res.json({ message: '404 Not Found' })
  } else {
      res.type('txt').send('404 Not Found')
  }
})

// iniitalize error handler
app.use(errorHandler);

//start the express server
app.listen(PORT, () => {
  console.log(`Express server is running on port: ${PORT}`);
});

module.exports = app;