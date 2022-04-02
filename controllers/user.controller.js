const UserModel = require('../models/user.model');
const ObjectID = require('mongoose').Types.ObjectId;

module.exports.getAllUsers = async (req, res) => {
    // disable password transit and select all the users
    const users = await UserModel.find().select('-password');
    res.status(200).json(users);
}

module.exports.userInfo = async (req, res) => {
    console.log(req.params);

    // checking if id is registered
    if (!ObjectID.isValid(req.params.id)) {
        res.status(400).send('ID unknown: ' + req.params.id);
    }
    UserModel.findById(req.params.id, (err, docs) => {
        console.log(err, !err);
        if (!err) {

            // fetch data
            res.send(docs);
        }
        else console.log('ID unknown: ' + err);
    }).select('-password');
};

module.exports.updateUser = async (req, res) => {

    // checking if id is registered
    if (!ObjectID.isValid(req.params.id)) {
        return res.status(400).send('ID unknown: ' + req.params.id);
    }
    await UserModel.findOneAndUpdate(
        // identify the content to be modified by its id
        { _id: req.params.id },
        {
            // modify the elements (if they dont exist the will be created)
            $set: {
                bio: req.body.bio
            }
        },
        {
            new: true,
            upsert: true,
            setDefaultsOnInsert: true
        }
    ).then(r => {
        return res.status(200).send({ r });
    }).catch(error => {
        return res.status(500).send({ message: error });
    });
};

module.exports.deleteUser = async (req, res) => {

    // checking if id is registered
    if (!ObjectID.isValid(req.params.id)) {
        return res.status(400).send('ID unknown: ' + req.params.id);
    }
    try {
        await UserModel.remove({ _id: req.params.id }).exec();
        res.status(200).json({ message: "Successfully deleted. " });

    } catch (err) {
        return res.status(500).send({ message: err });
    }
};

module.exports.follow = async (req, res) => {

    // checking if the follower/followed id are correct
    if (!ObjectID.isValid(req.params.id) || !ObjectID.isValid(req.body.idToFollow)) {
        return res.status(400).send('ID unknown: ' + req.params.id);
    }
    try {

        //add to the follower list
        let x = await UserModel.findByIdAndUpdate(
            req.params.id,
            {
                $addToSet:
                    { following: req.body.idToFollow }
            },
            {
                new: true,
                upsert: true
            }
        );
        //add to following list
        let y = await UserModel.findByIdAndUpdate(
            req.body.idToFollow,
            {
                $addToSet:
                    { followers: req.params.id }
            },
            {
                new: true,
                upsert: true
            }
        );

        res.status(201).send({
            x: x,
            y: y
        });

    } catch (err) {
        return res.status(500).send({ message: err });
    }


};

module.exports.unfollow = async (req, res) => {

    // checking if the follower/followed id are correct 
    if (!ObjectID.isValid(req.params.id) || !ObjectID.isValid(req.body.idToFollow)) {
        res.status(400).send('ID unknown: ' + req.params.id);
    }
    try {
        let x = await UserModel.findByIdAndUpdate(
            req.params.id,
            {
                $addToSet:
                    { following: req.body.idToUnfollow }
            },
            {
                new: true,
                upsert: true
            }
        );
        //add to following list
        let y = await UserModel.findByIdAndUpdate(
            req.body.idToUnfollow,
            {
                $pull:
                    { followers: req.params.id }
            },
            {
                new: true,
                upsert: true
            }
        );

        res.status(201).send({
            x: x,
            y: y
        });
    } catch (err) {
        return res.status(500).send({ message: err });
    }
};