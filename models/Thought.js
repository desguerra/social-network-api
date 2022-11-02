const { Schema, model, Types } = require('mongoose');
const dateFormat = require('../utils/dateFormat');

// schema only, not a model - used as the reactions field's
// subdocument schema in the Thought model
const ReactionSchema = new Schema(
  {
    // set custom id to avoid confusion with parent thought's _id field
    reactionId: {
      type: Schema.Types.ObjectId,
      default: () => new Types.ObjectId(),
    },
    reactionBody: {
      type: String,
      required: true,
      maxLength: 280
    },
    username: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: (createdAtVal) => dateFormat(createdAtVal),
    },
  },
  {
    toJSON: {
      getters: true,
    },
  }
);

const ThoughtSchema = new Schema(
  {
    thoughtText: {
      type: String,
      required: true,
      minLength: 1,
      maxLength: 280
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: (createdAtVal) => dateFormat(createdAtVal),
    },
    username: {
      type: String,
      required: true,
      // (The user that created this thought) - in this project,
      // have them directly input their username in insomnia
    },
    reaction: [ReactionSchema]
  },
  {
    toJSON: {
      virtuals: true,
      getters: true
    },
    id: false
    // ReactionSchema does not use `id: false` bc we are making its own id
  }
);

// get total count of reactions on retrieval
ThoughtSchema.virtual('reactionCount').get(function() {
  return this.reaction.length;
});

const Thought = model('Thought', ThoughtSchema);

module.exports = Thought;