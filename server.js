const express = require('express');
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const userRoutes = require("./routes/user.routes");
const postRoutes = require("./routes/post.routes");


require('dotenv').config({path:'./config/.env'});
require('./config/db'); 
const { checkUser, requireAuth } = require('./middleware/auth.middleware');

const app = express();

// accept json req bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

//jwt
app.get('*', checkUser);
app.get('/jwtid', requireAuth, (req, res) => {
    res.status(200).send(res.locals.user._id)
});

// set routes for '/'
app.use('/api/user', userRoutes);
app.use('/api/post',postRoutes);

// Start the server
app.listen(process.env.PORT, () => {
    console.log(`listening on port ${process.env.PORT}`)
})