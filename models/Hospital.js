const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const hospitalSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: 'Please enter a hospital name!'
  },
  slug: String,
  description: {
    type: String,
    trim: true
  },
  tags: [String],
  created: {
    type: Date,
    default: Date.now
  },
  location: {
    type: {
      type: String,
      default: 'Point'
    },
    coordinates: [{
      type: Number,
      required: 'You must supply coordinates!'
    }],
    address: {
      type: String,
      required: 'You must supply an address!'
    }
  },
  photo: String,
  author: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: 'You must supply an author'
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

hospitalSchema.index({
  name: 'text',
  description: 'text'
});

hospitalSchema.index({ location: '2dsphere' });

/**
 * Password hash middleware.
 */
hospitalSchema.pre('save', function save(next) {
  const hospital = this;
  if (!hospital.isModified('password')) { return next(); }
  bcrypt.genSalt(10, (err, salt) => {
    if (err) { return next(err); }
    bcrypt.hash(hospital.password, salt, (err, hash) => {
      if (err) { return next(err); }
      hospital.password = hash;
      next();
    });
  });
});


const Hospital = mongoose.model('Hospital', hospitalSchema);

module.exports = Hospital;
