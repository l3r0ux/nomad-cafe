// "process.env.NODE_ENV" can be development or production
// If we are not running in production mode, take env variables and add them to process.env
if (process.env.NODE_ENV !== "production") {
    require('dotenv').config()
}

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
// for generating random token for subscribers
const session = require('express-session');
// Helmet is for security
const helmet = require('helmet');
const MongoStore = require('connect-mongo');
const errorTemplate = require('./views/error');
const app = express();
const authRoutes = require('./routes/auth');
const menuRoutes = require('./routes/menu');
const eventRoutes = require('./routes/event');
const galleryRoutes = require('./routes/gallery');
const locationRoutes = require('./routes/location');
const subscriberRoutes = require('./routes/subscriber');
const { strict } = require('assert');
const dbUrl = process.env.DBNAME;

mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("MONGOOSE CONNECTED")
    })
    .catch(err => {
        console.log("MONGOOSE ERROR")
        console.log(err)
    });

// make this a legit secret with environment variable before launch
const sessionConfig = {
    // Should also change the cookie name so that people dont know what to look for in the cookies
    name: 'session',
    // storing session data in mongo
    store: MongoStore.create({
        // put in process.env
        mongoUrl: dbUrl,
        secret: process.env.MONGOSTORESECRET,
        touchAfter: 24 * 60 * 60
    }),
    sameSite: strict,
    secret: process.env.SECRET,
    resave: false,
    // this is for https, enable when deploy !!!!!!!!!!!!!!!!!!!!!!
    // secure: true,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 3600000,
        maxAge: 3600000
    }
}

// This automatically enables all 11 of the middlewares that helmet comes with
// Content recurity policy designates what sources are allowed to get information from
app.use(helmet());
const scriptSrcUrls = [
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
];
const styleSrcUrls = [
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://fonts.gstatic.com",
];
const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",
];
const fontSrcUrls = [
    "https://fonts.googleapis.com/",
    "https://fonts.gstatic.com",
];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/djkyfcfl1/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);

app.use(session(sessionConfig));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Routers
app.use('/admin', authRoutes);
app.use('/', menuRoutes);
app.use('/', eventRoutes);
app.use('/', galleryRoutes);
app.use('/', locationRoutes);
app.use('/', subscriberRoutes);

// Home Route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './views/index.html'));
});

// Page not found route
// for all request, and every path:
app.all('*', (req, res, next) => {
    // send a nice 404 not found page here
    // Rendering error template with the custom error dynamically rendered in
    res.status(404).send(errorTemplate({ error: 'Error 404: Page Not Found!' }));
});

const port = process.env.PORT || 3000;
app.listen(port, (req, res) => {
    console.log(`Listening on port ${port}`);
})