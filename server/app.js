const express = require("express")
const bodyParser = require("body-parser")
const session = require("express-session");
const db  = require("./utils/db")
const mongoose = require("mongoose")

// Mongo Session
const MongoDBStore = require("connect-mongodb-session")(session);
const store = new MongoDBStore({
    uri: db,
    collection: "session",
});

//Route Imports
const authRoutes =require("./routes/auth")
const habitRoutes = require("./routes/habit")

const app =  express()

app.use(express.static("../client")) // Temporary until use angular

app.use(
    session({
        secret: "habittracker",
        resave: true,
        saveUninitialized: false,
        store: store,
        rolling:true,
        cookie: {maxAge:14*24*60*60*1000 } // 2 weeks 
    })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Routes
app.use("/auth",authRoutes)
app.use("/api",habitRoutes)

//Connect to database and start server
mongoose
.connect(db, { useNewUrlParser: true, useUnifiedTopology: true,useCreateIndex:true,useFindAndModify:false })
.then(() => {
    console.log("Starting Server");
    app.listen(process.env.PORT || 3000)
});



