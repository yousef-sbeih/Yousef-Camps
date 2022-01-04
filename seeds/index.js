const mongoose = require("mongoose");

const Campground = require("../models/campground");
const cities = require("./cities");
const { places, descriptors } = require("./helpers");

mongoose
  .connect("mongodb://localhost:27017/yelp-camp", {
    maxPoolSize: 50,
    wtimeoutMS: 2500,
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("database opened");
  })
  .catch((err) => {
    console.log(err);
  });

const sample = (arr) => {
  return arr[Math.floor(Math.random() * arr.length)];
  console.log("from sample ", arr);
};

const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 800; i++) {
    const random = Math.floor(Math.random() * 1000);
    const newCamp = new Campground({
      author: "6187ad359ba809e393431120",
      location: `${cities[random].city} , ${cities[random].state}`,
      geometry: {
        type: "Point",
        coordinates: [cities[random].longitude, cities[random].latitude],
      },
      title: `${sample(descriptors)} ${sample(places)}`,
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco",
      price: Math.floor(Math.random() * 50),
      image: [
        {
          url: "https://res.cloudinary.com/dxrfec0dv/image/upload/v1636652238/yousefCamp/qhhe7xqgfndi1vddosvg.jpg",
          filename: "yousefCamp/qhhe7xqgfndi1vddosvg",
        },
        {
          url: "https://res.cloudinary.com/dxrfec0dv/image/upload/v1636652223/yousefCamp/cblrmrvsp1gdopjcpmkt.jpg",
          filename: "yousefCamp/cblrmrvsp1gdopjcpmkt",
        },
      ],
    });
    await newCamp.save();
  }
};
seedDB().then(() => {
  mongoose.connection.close();
});
