const mongoose = require('mongoose');
const { Schema } = mongoose;

const JobSchema = new Schema(
  {
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      // required: [true, 'Please provide user'],
    },
    company: {
      type: String,
      required: [true, 'Please provide company name'],
      maxlength: 50,
    },
    position: {
      type: String,
      required: [true, 'Please provide position'],
      maxlength: 100,
    },
    status: {
      type: String,
      enum: ['interview', 'declined', 'pending'],
      default: 'pending',
    },
    jobLocation: {
      type: String,
      default: 'my city',
      required: true,
    },
    jobType: {
      type: String,
      enum: ['full-time', 'part-time', 'remote', 'internship'],
      default: 'internship',

    },

    
  },
  { timestamps: true }
)

// export default mongoose.model('Job', JobSchema)
module.exports = mongoose.model('Job',JobSchema)
