const { User } = require('../models');

const userController = {
  // GET all users
  getAllUsers(req, res) {
    User.find({})
      .populate({
        path: 'thoughts',
        select: '-__v',
      })
      .select('-__v')
      .sort({ _id: -1 })
      .then((dbUserData) => {
        res.json(dbUserData)
      })
      .catch((err) => {
        console.log(err);
        res.status(400).json(err);
      });
  },

  // GET single user by its _id & populated thought & friend data
  getUserById({ params }, res) {
    User.findOne({ _id: params.userId })
      .populate({
        path: 'thoughts',
        select: '-__v',
      })
      .select('-__v')
      .then((dbUserData) => {
        if (!dbUserData) {
          res.status(404).json({ message: 'No user found with this id!' });
          return;
        }
        res.json(dbUserData);
      })
      .catch((err) => {
        console.log(err);
        res.status(400).json(err);
      });
  },

  // POST new user
  createUser({ body }, res) {
    User.create(body)
      .then((dbUserData) => res.json(dbUserData))
      .catch((err) => res.status(400).json(err));
  },

  // PUT to update user by its _id
  updateUser({ params, body }, res) {
    User.findOneAndUpdate({ _id: params.userId }, body, { new: true, runValidators: true })
      .then(dbUserData => {
        if (!dbUserData) {
          res.status(404).json({ message: 'No user found with this id!' });
          return;
        }
        res.json(dbUserData);
      })
      .catch(err => res.status(400).json(err));
  },

  // DELETE to remove user by its _id
  deleteUser({ params }, res) {
    User.findOneAndDelete({ _id: params.userId })
      .then((dbUserData) => {
        if (!dbUserData) {
          res.status(404).json({ message: 'No user found with this id!' });
          return;
        }
        res.json(dbUserData);
      })
      .catch((err) => res.status(400).json(err));
  },

  // TODO: BONUS - REMOVE USER'S ASSOCIATED THOUGHTS WHEN DELETED

  // FIXME: POST to add a new friend to a user's friend list
  addFriend({ body }, res) {
    User.findOneAndUpdate(
      { _id: params.userId },
      { $push: { friends: body } },
      { new: true }
    )
      .then((dbUserData) =>{
        if (!dbUserData) {
          res.status(404).json({ message: 'No user found with this id!' });
          return;
        }
        res.json(dbUserData)
      })
      .catch((err) => res.status(400).json(err));
  },

  // FIXME: DELETE to remove a friend from a user's friend list
  removeFriend({ params }, res) {
    User.findOneAndUpdate(
      { _id: params.userId },
      { $pull: { friends: { friendId: params.friendId } } },
      { new: true }
    )
      .then(dbUserData => res.json(dbUserData))
      .catch(err => res.json(err));
  }
};

module.exports = userController;