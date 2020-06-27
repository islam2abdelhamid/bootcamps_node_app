const mongoose = require('mongoose');
const slugify = require('slugify');

const geocoder = require('../utils/geocoder');

const BootcampSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'name is required'],
      unique: true,
      trim: true,
      maxlength: [50, 'name can not be more than 50 characters'],
    },
    slug: String,
    description: {
      type: String,
      required: [true, 'description is required'],
      maxlength: [500, 'description can not be more than 500 characters'],
    },
    website: {
      type: String,
      match: [
        /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/,
        'url is not valid',
      ],
    },
    phone: {
      type: String,
      maxlength: [20, 'phone number can not be more than 20 characters'],
    },
    email: {
      type: String,
      match: [/^([\w\.]*)(@)([\w\.]*)?(.com)$/, 'email is not valid'],
    },
    address: {
      type: String,
      required: [true, 'address is required'],
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
      },
      coordinate: {
        type: [Number],
        index: '2dsphere',
      },
      formattedAddress: String,
      street: String,
      city: String,
      state: String,
      zipcode: String,
      country: String,
    },
    careers: {
      type: [String],
      required: [true, 'career is required'],
      enum: [
        'Web Development',
        'Mobile Development',
        'UI/UX',
        'Data Science',
        'Business',
        'Other',
      ],
    },
    averageRating: {
      type: Number,
      min: [1, 'rating must be at least 1'],
      max: [10, 'rating can not be more than 10'],
    },
    averageCost: Number,
    photo: {
      type: String,
      default: 'no-photo.jpg',
    },
    housing: {
      type: Boolean,
      default: false,
    },
    jobAssistance: {
      type: Boolean,
      default: false,
    },
    jobGuarantee: {
      type: Boolean,
      default: false,
    },
    acceptGi: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Create Bootcamp slug from the name
BootcampSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// Geocode & create location field
BootcampSchema.pre('save', async function (next) {
  const loc = await geocoder.geocode(this.address);
  this.location = {
    type: 'Point',
    coordinates: [loc[0].longitude, loc[0].latitude],
    formattedAddress: loc[0].formattedAddress,
    street: loc[0].streetName,
    city: loc[0].city,
    state: loc[0].stateCode,
    zipcode: loc[0].zipcode,
    country: loc[0].countryCode,
  };

  this.address = undefined;
  next();
});

module.exports = mongoose.model('Bootcamp', BootcampSchema);
