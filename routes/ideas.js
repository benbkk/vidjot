const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const { ensureAuthenticated } = require('../helpers/auth')

// Idea Model
require('../models/Idea')
const Idea = mongoose.model('ideas')

// Ideas Route
router.get('/', ensureAuthenticated, (req, res) => {
  Idea.find({user: req.user.id})
    .sort({date: 'desc'})
    .then(ideas => {
      res.render('ideas/index', {
        ideas,
      })
    })
})

// Add Idea
router.get('/add', ensureAuthenticated, (req, res) => {
  res.render('ideas/add')
})

// Edit Idea
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
  Idea.findOne({
    _id: req.params.id
  })
  .then(idea => {
    if (idea.user !== req.user.id) {
      req.flash('error_msg', 'Not Authorized')
      res.redirect('/ideas')
    } else {
      res.render('ideas/edit', {
        idea
      })
    }
  })
})

// Process Edit Video Form

router.put('/:id', (req, res) => {
  Idea.findOne({
    _id: req.params.id,
  })
  .then(idea => {
    idea.title = req.body.title
    idea.details = req.body.details
    idea.save()
      .then(idea => {
        req.flash('success_msg', 'Idea updated.')
        res.redirect('/ideas')
      })
  })
})

// Process Add Video Form

router.post('/', (req, res) => {
  let errors = []

  if (req.body.title === '') {
    errors.push({
      text: 'Title is Required'
    })
  }

  if (req.body.details === '') {
    errors.push({
      text: 'Details is Required'
    })
  }

  if (errors.length > 0) {
    res.render('ideas/add', {
      errors: errors,
      title: req.body.title,
      details: req.body.details
    })
  } else {
    const newUser = {
      title: req.body.title,
      details: req.body.details,
      user: req.user.id
    }
    new Idea(newUser)
      .save()
      .then(idea => {
        req.flash('success_msg', 'Your new video idea is added!')
        res.redirect('/ideas')
      })
  }
})

// Delete Idea

router.delete('/:id', (req, res) => {
  Idea.deleteOne({
    _id: req.params.id
  })
  .then(() => {
    req.flash('success_msg', 'Video idea was removed')
    res.redirect('/ideas')
  })
})

module.exports = router