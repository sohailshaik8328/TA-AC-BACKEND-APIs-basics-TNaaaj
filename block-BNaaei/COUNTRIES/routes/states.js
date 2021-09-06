var express = require('express');
var router = express.Router();
var States = require('../models/states');
var Countries = require('../models/countries');
//add a state
router.post('/:id/states', (req, res, next) => {
  let id = req.params.id;
  req.body.country = id;
  States.create(req.body, (err, state) => {
    if (err) return next(err);
    Countries.findByIdAndUpdate(
      id,
      { $push: { states: state.id } },
      (err, country) => {
        if (err) return next(err);
        res.status(200).json({ state });
      }
    );
  });
});

//list all states



router.get('/:id/states', (req, res, next) => {
  let id = req.params.id;
  Countries.findById(id)
    .populate({
      path: 'states',
      select: 'name_of_state',
      options: { sort: { name_of_state: -1 } },
    })
    .exec((err, country) => {
      if (err) return next(err);
      res.status(200).json({ country });
    });
});

//list all the neighbouring countries
router.get('/:id/neighbours', (req, res, next) => {
  let id = req.params.id;
  Countries.find({ _id: id })
    .populate('neighbouring_countries')
    .exec((err, country) => {
      if (err) return next(err);
      res.status(200).json({ neighbours: country[0].neighbouring_countries });
    });
});

//list all religions
router.get('/find/religions', (req, res, next) => {
  Countries.find({})
    .distinct('ethnicity')
    .exec((err, result) => {
      if (err) return next(err);
      res.status(200).json({ result });
    });
});

//list countries based on continent
router.get('/find/continent/:id', (req, res, next) => {
  let continent = req.params.id;
  Countries.find({ continent }, (err, country) => {
    if (err) return next(err);
    res.status(200).json({ country });
  });
});

//list countries based on population
router.get('/find/population/:id', (req, res, next) => {
  let population = req.params.id;
  Countries.find({ population }, (err, country) => {
    if (err) return next(err);
    res.status(200).json({ country });
  });
});

//list countries based on ethnicity
router.get('/find/ethnicity/:id', (req, res, next) => {
  let ethnicity = req.params.id;
  Countries.find({ ethnicity: { $in: ethnicity } }, (err, country) => {
    if (err) return next(err);
    res.status(200).json({ country });
  });
});
//ascending order of population
router.get('/', (req, res, next) => {
  States.find({})
    .sort({ population: 1 })
    .exec((err, states) => {
      if (err) return next(err);
      res.status(200).json({ states });
    });
});

//add neighbours to states
router.put('/:id/addneighbour', (req, res, next) => {
  let id = req.params.id;
  let { neighbour } = req.body;
  States.findOne({ name_of_state: neighbour }, (err, state) => {
    if (err) return next(err);
    console.log(state);
    States.findByIdAndUpdate(
      id,
      { $push: { neighbouring_states: state._id } },
      (err, updatedstate) => {
        if (err) return next(err);
        console.log(upstate);
        res.status(200).json({ updatedstate });
      }
    );
  });
});

//list all the neighboring states
router.get('/:id/neighbours', (req, res, next) => {
  let id = req.params.id;
  States.findById(id)
    .populate('neighbouring_states')
    .exec((err, state) => {
      if (err) return next(err);
      res.status(200).json({ neighbours: state[0].neighbouring_states });
    });
});

//remove a state from a country
router.delete('/:id/remove', (req, res, next) => {
  let id = req.params.id;
  States.findById(id, (err, state) => {
    if (err) return next(err);
    Countries.findByIdAndUpdate(
      state.country,
      { $pull: { neighbouring_states: id } },
      (err, country) => {
        if (err) return next(err);
        res.status(200).json({ country });
      }
    );
  });
});

module.exports = router;
