const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const db = require("./utils/db");
const mongoose = require("mongoose");
const fs = require("fs");

// Mongo Session
const MongoDBStore = require("connect-mongodb-session")(session);
const store = new MongoDBStore({
   uri: db,
   collection: "session",
});

//Route Imports
const authRoutes = require("./routes/auth");
const habitRoutes = require("./routes/habit");

//Additional Middleware
const {uploadParser} = require("./middleware/upload-parser")

const app = express();

app.use(
   session({
      secret: "habittracker",
      resave: true,
      saveUninitialized: false,
      store: store,
      rolling: true,
      cookie: { maxAge: 14 * 24 * 60 * 60 * 1000 }, // 2 weeks
   })
);

//Content parsers
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(uploadParser)


app.use((req,res,next)=>{
   console.log(req.originalUrl,req.headers,req.body)
   next()
})

//Routes
app.use("/api/auth", authRoutes);
app.use("/api", habitRoutes);

if (process.env.NODE_ENV == "production") {
   app.use(express.static("../client/dist/angular"));
   app.use((req, res) => {
      fs.promises.readFile("../client/dist/angular/index.html").then((data) => {
         res.header("content-type", "text/html");
         res.send(data.toString());
      });
   });
}

app.use((err, req, res, next) => {
	res.status(503).send({
        error:err
    });
})

//Connect to database and start server
mongoose
   .connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
   })
   .then(() => {
      console.log("Starting Server");
      app.listen(process.env.PORT || 3000);
   });
