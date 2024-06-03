const Hotel = require("../models/hotel.js");

module.exports.isLoggedIn = (req, res, next) => {
  console.log("Req.user is ", req.user);
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    req.flash("error", "You must be signed in first");
    return res.redirect("/login");
  }
  next();
};

module.exports.storeReturnTo = (req, res, next) => {
  if (req.session.returnTo) {
    res.locals.returnTo = req.session.returnTo;
  }
  next();
};

module.exports.isOwner = async (req, res, next) => {
  const id = req.params.id;
  const hotel = await Hotel.findById(id);
  if (!req.user._id.equals(hotel.Owner)) {
    req.flash("error", "you do not have permission to do that");
    return res.redirect(`/Hotels/${id}`);
  }
  next();
};
