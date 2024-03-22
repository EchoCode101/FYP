const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review");
const listingSchema = Schema({
  title: { type: String, required: true, maxLength: 40 },
  description: {
    type: Object,
    default: "Remote",
    // enum: [
    //   "Remote",
    //   "Onsite",
    //   "Hybrid",
    //   "Villa",
    //   "Apartment",
    //   "House",
    //   "Hotel",
    //   "Compartments",
    //   "Office",
    //   "Other",
    //   "Flat",
    // ],
  },
  price: { type: Number, required: true, min: 0, default: 0, maxLength: 10 },
  location: {
    type: String,
    default: "Remote",
  },
  image: {
    filename: { type: String, default: "listingimage" },
    url: {
      type: String,
      default: "https://via.placeholder.com/150",
      set: (url) => (url === "" ? "https://via.placeholder.com/150" : url),
    },
  },
  country: String,
  review: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  geometry: {
    type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ["Point"], // 'location.type' must be 'Point'
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  createdAt: { type: Date, default: Date.now() },
});

listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.review } });
  }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
