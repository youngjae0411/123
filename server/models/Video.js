const mongoose = require('mongoose')
const Schema = require('mongoose').Schema;


const videoSchema = mongoose.Schema({
  writer: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  title : {
    type : String
  },
  description : {
    type : String
  },
  privacy: {
    type : Number
  },
  filePath: {
    type: String
  },
  category : {
    type: String
  },
  views : {
    type: Number,
    default: 0
  },
  duration: {
    type: String
  },
  thumbnail: {
    type: String
  }
}, {timestamps: true})

const Video = mongoose.model('Video', videoSchema);

module.exports = { Video }