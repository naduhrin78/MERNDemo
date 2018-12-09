const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const router = express.Router();

const User = require("./../../models/User");
const Profile = require("./../../models/Profile");
const profileValidator = require("./../../validation/profile");

// @route   GET api/profiles
// @desc    Get profile of current user
// @access  Private
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    let errors = {};
    Profile.findOne({ user: req.user.id })
      .populate("user", ["name", "avatar"])
      .then(profile => {
        if (!profile) {
          errors.profile = "Profile not found";
          return res.status(404).json(errors);
        }

        return res.json(profile);
      })
      .catch(err => console.log(err));
  }
);

// @route   POST api/profiles
// @desc    Creates or updates a user profile
// @access  Protected
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const profileFields = {};

    const { errors, isValid } = profileValidator(req.body);

    if (!isValid) return res.status(400).json(errors);

    profileFields.user = req.user.id;
    if (req.body.handle) profileFields.handle = req.body.handle;
    if (req.body.company) profileFields.company = req.body.company;
    if (req.body.website) profileFields.website = req.body.website;
    if (req.body.location) profileFields.location = req.body.location;
    if (req.body.status) profileFields.status = req.body.status;
    if (typeof req.body.skills !== "undefined")
      profileFields.skills = req.body.skills.split(",");

    profileFields.social = {};

    // social
    if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
    if (req.body.instagram) profileFields.social.instagram = req.body.instagram;
    if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
    if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
    if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;

    Profile.findOne({ user: req.user.id }).then(profile => {
      if (profile) {
        Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        ).then(profile => res.json(profile));
      } else {
        Profile.findOne({ handle: req.user.handle })
          .then(profile => {
            if (profile) {
              errors.handle = "Handle already taken";
              return res.status(400).json(errors);
            }
          })
          .catch(err => res.status(400).json(err));

        new Profile(profileFields).save().then(profile => res.json(profile));
      }
    });
  }
);

module.exports = router;