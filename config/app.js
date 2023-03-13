var createError = require("http-errors");
var express = require("express");
var logger = require("morgan");
// let compress = require("compression");
// let bodyParser = require('body-parser');
// let methodOverride = require('method-override');
let passport = require("passport");
let cors = require("cors");

var indexRouter = require("../routes/index");
var usersRouter = require("../routes/users");
var medHisRouter = require("../routes/medical-record");

var errorHandler = require("./error-handler");

var app = express();

// Enable cors
app.use(cors());
app.options('*', cors());

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Sets up passport
app.use(passport.initialize());

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/medical-record", medHisRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(errorHandler.errorHandlerMiddleware);

module.exports = app;
