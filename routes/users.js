const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const passport = require('passport')

require('../models/User')
const User = mongoose.model('users')

// USER LOGIN

router.get('/login', (req, res) => {
  res.render('users/login')
})

router.get('/register', (req, res) => {
  res.render('users/register')
})

// Register post
router.post('/register', (req, res) => {
  console.log(req.body)
  let errors = []

  if (!req.body.name || req.body.name === '') {
    errors.push({text: 'Name is Required'})
  } 

  if (!req.body.password || req.body.password === '') {
    errors.push({text: 'Password is Required'})
  }

  if (req.body.password !== '' && req.body.password.length < 4) {
    errors.push({text: 'Password should be at least 4 characters'})
  }

  if (req.body.password !== req.body.password2) {
    errors.push({text: 'Password do not match'})
  }

  if (errors.length > 0) {
    res.render('users/register', {
      errors,
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      password2: req.body.password2
    })
  } else {
    User.findOne({ email: req.body.email })
      .then(user => {
        if (user) {
          req.flash('error_msg', 'User\'s email already registered')
          res.redirect('/users/login')
        } else {
          const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
          })
      
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if (err) throw err
              newUser.password = hash
              newUser.save()
                .then(user => {
                  req.flash('success_msg', 'Registration successful. You may now login.')
                  res.redirect('/users/login')
                })
                .catch(err => {
                  console.log(err)
                  return
                })
            })
          })
        }
      })
  }
})

module.exports = router