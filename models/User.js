const { Schema, model } = require('mongoose');

const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      unique: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      // TODO: ADD EMAIL MATCHING VALIDATOR
    },
    thoughts: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Thought'
      }
    ],
    friends: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
  },
  {
    toJSON: {
      virtuals: true,
      getters: false // FIXME: can we remove this?
    },
    id: false
  }
);

// get total count of friends retrieval
UserSchema.virtual('friendCount').get(function() {
  return this.friends.length;
});

// create the User model using the UserSchema
const User = model('User', UserSchema);

module.exports = User;