import createError from "http-errors";
import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import { handlebars } from 'hbs';
import { engine } from 'express-handlebars';


const app = express();



// view engine setup
app.engine('hbs', engine(
  {
    helpers: {
      safeVal(value, safeValue) {
        var out = value || safeValue;
        return new handlebars.SafeString(out);
      },
      section(name, options){
        if(!this._sections) this._sections = {};
        (this._sections as any)[name] = options.fn(this);
        return null;
    }
    },

    layoutsDir: path.join(__dirname, "/views/layouts"),
    partialsDir:  path.join(__dirname, "/views/partials"),
    defaultLayout: "layout",
    extname: "hbs",
    runtimeOptions: {
      allowProtoPropertiesByDefault: true
    }
  }
));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

const homeRouter = require("./routes/home");
app.use("/", homeRouter);

const wikiRouter = require("./routes/wiki");
app.use("/wiki", wikiRouter);
app.use("/wiki/content", express.static(path.join(__dirname, "../../content")));

const galleryRouter = require("./routes/gallery");
app.use("/gallery", galleryRouter);
app.use("/gallery", express.static(path.join(__dirname, "../../gallery")));

const timelineRouter = require("./routes/timeline");
app.use("/timeline", timelineRouter);

app.use(express.static(path.join(__dirname, "public")));


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // console.error(err);
  
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
