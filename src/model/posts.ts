import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    title: { type: String },
    body: { type: String },
    media: { type: Array },
    posted_at: { type: Date },
    is_edited: { type: Boolean, default: false },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    tagged: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false }],
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required:false }]
  });
export const PostsModel = mongoose.model( 'Posts', postSchema);

const commentSchema = new mongoose.Schema({
    body: { type: String },
    media: { type: String },
    posted_at: { type: Date },
    is_edited: { type: Boolean, default: false },
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'Posts', required: true },
    tagged: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false }],
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required:false }]
  });
export const CommentsModel = mongoose.model( 'Comments', commentSchema);

const replySchema = new mongoose.Schema({
    body: { type: String },
    media: { type: String },
    posted_at: { type: Date },
    is_edited: { type: Boolean, default: false },
    comment: { type: mongoose.Schema.Types.ObjectId, ref: 'Comments', required: true },
    tagged: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false }],
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required:false }]
  });
export const ReplySchema = mongoose.model( 'Replies', replySchema);
