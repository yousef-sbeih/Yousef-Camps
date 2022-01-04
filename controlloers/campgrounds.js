const campground = require("../models/campground");
const Campground = require("../models/campground");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;

const geoCoder = mbxGeocoding({ accessToken: mapBoxToken });
module.exports.index = async (req, res) => {
  const camps = await Campground.find({});
  res.render("campgrounds/index", { camps });
};
module.exports.newCampground = (req, res) => {
  res.render("campgrounds/new");
};
module.exports.createCampground = async (req, res) => {
  const geoData = await geoCoder
    .forwardGeocode({
      query: req.body.campground.location,
      limit: 1,
    })
    .send();
  console.log("geo data", geoData.body);
  const campground = new Campground(req.body.campground);
  campground.geometry = geoData.body.features[0].geometry;
  campground.image = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));
  campground.author = req.user._id;
  await campground.save();
  req.flash("success", "Done !");
  res.redirect(`/campgrounds/${campground.id}`);
};
module.exports.renderEditCampground = async (req, res) => {
  const camp = await Campground.findById(req.params.id);
  res.render("campgrounds/edit", { camp });
};
module.exports.editCampground = async (req, res) => {
  const camp = await Campground.findByIdAndUpdate(req.params.id, {
    ...req.body.campground,
  });
  const imgs = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));
  camp.image.push(...imgs);
  await camp.save();
  req.flash("success", "Done !");
  res.redirect(`/campgrounds/${camp.id}`);
};
module.exports.showCampground = async (req, res) => {
  const camp = await Campground.findById(req.params.id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("author");
  res.render("campgrounds/show", { camp });
};
module.exports.deleteCampground = async (req, res) => {
  const { id } = req.params;
  await Campground.findByIdAndDelete(id);
  req.flash("success", "Done !");
  res.redirect("/campgrounds");
};
