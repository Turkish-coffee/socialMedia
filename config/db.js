const mongoose = require('mongoose');
mongoose.
    connect('mongodb+srv://' + process.env.DB_USER_PASS + '@socialmedia.umbxo.mongodb.net/socialMedia',
        {
            useNewUrlParser: true,
        }
    )
    .then(() => console.log('Connected to MongoDB '))
    .catch((err) => console.log("Failed to connect to MongoDB", err));

