const mongoose = require("mongoose");
const Review = require("./review");
const Schema = mongoose.Schema;
const opts = { toJSON: { virtuals: true } };

const CampGroundSchema = new Schema(
  {
    title: String,
    image: [{ url: String, filename: String }],
    price: Number,
    description: String,
    geometry: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    location: String,
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  opts
);
CampGroundSchema.virtual("properties.popUpMarup").get(function () {
  return `<a href= "/campgrounds/${this._id}">${this.title}</a>
          <p> ${this.description.substring(0, 25)}</p>`;
});

CampGroundSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await Review.deleteMany({
      _id: {
        $in: doc.reviews,
      },
    });
  }
});
module.exports = mongoose.model("Campground", CampGroundSchema);
