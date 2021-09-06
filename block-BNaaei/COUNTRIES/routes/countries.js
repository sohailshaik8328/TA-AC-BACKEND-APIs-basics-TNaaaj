var express = require('express');
var router = express.Router();
var Countries = require('../models/countries');
/* GET home page. */
//add a country details
router.post('/', function (req, res, next) {
  req.body.ethnicity = req.body.ethnicity.trim().split(',');
  Countries.create(req.body, (err, country) => {
    res.status(200).json({ country });
  });
});
//details of one country
router.get('/:id', (req, res, next) => {
  let id = req.params.id;
  Countries.findById(id, (err, country) => {
    if (err) return next(err);
    res.status(200).json({ country });
  });
});
//update a specific country details
router.put('/:id', (req, res, next) => {
  let id = req.params.id;
  req.body.ethnicity = req.body.ethnicity.trim().split(',');
  Countries.findByIdAndUpdate(id, req.body, (err, country) => {
    if (err) return next(err);
    console.log(country);
    res.status(200).json({ country });
  });
});

//delete a specific country
router.delete('/:id', (req, res, next) => {
  let id = req.params.id;
  Countries.findByIdAndDelete(id, (err, country) => {
    if (err) return next(err);
    res.status(200).json({ country });
  });
});
//add neighbouring countries
router.put('/:id/addneighbour', (req, res, next) => {
  let id = req.params.id;
  let name = req.body.name;
  console.log(name);
  Countries.findOne({ name }, (err, country) => {
    if (err) return next(err);
    Countries.findByIdAndUpdate(
      id,
      { $push: { neighbouring_countries: country._id } },
      (err, updatedCountry) => {
        if (err) return next(err);
        res.status(200).json({ updatedCountry });
      }
    );
  });
});
module.exports = router;



