let express = require('express');
let router = express.Router();
let Newbook = require('../models/newbooks');
let Book = require('../models/newbooks');
let Comment = require('../models/comments');
//list all books***********

router.get('/', (req, res, next) => {
  Newbook.find({}, (err, books) => {
    if (err) return next(err);
    res.status(200).json({ books });
  });
});

//list a single book
router.get('/:id', (req, res, next) => {
  let id = req.params.id;
  Newbook.findById(id)
    .populate('comments')
    .exec((err, book) => {
      if (err) return next(err);
      res.status(200).json({ book });
    });
});

//create a book
router.post('/', (req, res, next) => {
  Newbook.create(req.body, (err, book) => {
    if (err) return next(err);
    res.status(200).json({ book });
  });
});

//update a book
router.put('/:id', (req, res, next) => {
  let id = req.params.id;
  Newbook.findByIdAndUpdate(id, req.body, (err, book) => {
    if (err) return next(err);
    res.status(200).json({ book });
  });
});

//delete a book
router.delete('/:id', (req, res, next) => {
  let id = req.params.id;
  Newbook.findByIdAndDelete(id, (err, book) => {
    if (err) return next(err);
    Comment.deleteMany({ booksId: id }, (err, result) => {
      if (err) return next(err);
      res.status(200).json({ book });
    });
  });
});

//add comments
router.post('/newcomments/:id/comments', (req, res, next) => {
  let id = req.params.id;
  req.body.bookId = id;
  Comment.create(req.body, (err, comment) => {
    if (err) return next(err);
    Newbook.findByIdAndUpdate(
      id,
      { $push: { comments: comment.id } },
      (err, book) => {
        if (err) return next(err);
        res.status(200).json({ comment });
      }
    );
  });
});
//edit comments
router.put('/newcomments/:id', (req, res, next) => {
  let id = req.params.id;
  Comment.findByIdAndUpdate(id, req.body, (err, comment) => {
    if (err) return next(err);
    res.status(200).json({ comment });
  });
});

//delete comment
router.delete('/newcomments/:id', (req, res, next) => {
  let id = req.params.id;
  Comment.findByIdAndDelete(id, (err, comment) => {
    if (err) return next(err);
    Newbook.findByIdAndUpdate(
      comment.bookId,
      { $pull: { comments: id } },
      (err, book) => {
        if (err) return next(err);
        res.status(200).json({ comment });
      }
    );
  });
});
//create a category
router.put('/:id/addCategory', (req, res, next) => {
  let id = req.params.id;
  req.body.category = req.body.category.trim().split(',');
  Newbook.findByIdAndUpdate(id, req.body, (err, book) => {
    if (err) return next(err);
    res.status(200).json({ book });
  });
});

//edit a category
router.put('/:id/editCategory', (req, res, next) => {
  let id = req.params.id;
  req.body.category = req.body.category.trim().split(',');
  Newbook.findByIdAndUpdate(id, req.body, (err, book) => {
    if (err) return next(err);
    res.status(200).json({ book });
  });
});

//list all categories
router.get('/list/Category', (req, res, next) => {
  Newbook.find({})
    .distinct('category')
    .exec((err, category) => {
      if (err) return next(err);
      res.status(200).json({ category });
    });
});

//list books by category
router.get('/list/byCategory', (req, res, next) => {
  Newbook.aggregate([{ $unwind: '$category' }]).exec((err, books) => {
    if (err) return next(err);
    res.status(200).json({ books });
  });
});

//count books by category
router.get('/countby/category', (req, res, next) => {
  Newbook.aggregate([
    { $group: { _id: '$category', count: { $sum: 1 } } },
    { $unwind: '$category' },
  ]).exec((err, result) => {
    if (err) return next(err);
    res.status(200).json({ result });
  });
});

//list book by author
router.get('/filter/byauthor', (req, res, next) => {
  Newbook.aggregate([
    {
      $group: {
        _id: '$author',
        books: {
          $push: '$$ROOT',
        },
      },
    },
  ]).exec((err, result) => {
    if (err) return next(err);
    res.status(200).json({ result });
  });
});

//add tags to books
router.put('/:id/addtags', (req, res, next) => {
  let id = req.params.id;
  req.body.tags = req.body.tags.trim().split(',');
  Newbook.findByIdAndUpdate(id, req.body, (err, book) => {
    if (err) return next(err);
    res.status(200).json({ book });
  });
});

//list all tags in ascending
router.get('/filter/tags', (req, res, next) => {
  Newbook.aggregate([{ $unwind: '$tags' }, { $sort: { tags: 1 } }]).exec(
    (err, result) => {
      if (err) return next(err);
      res.status(200).json({ result });
    }
  );
});

//filter books by tags
router.get('/list/tags', (req, res, next) => {
  Newbook.aggregate([{ $unwind: '$tags' }]).exec((err, result) => {
    if (err) return next(err);
    res.status(200).json({ result });
  });
});
//countby tags
router.get('/countby/tags', (req, res, next) => {
  Newbook.aggregate([
    { $unwind: '$tags' },
    { $group: { _id: '$tags', count: { $sum: 1 } } },
  ]).exec((err, tags) => {
    if (err) return next(err);
    res.status(200).json({ tags });
  });
});
module.exports = router;
