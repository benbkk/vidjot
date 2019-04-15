const path = require('path')
const express = require('express')
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const flash = require('connect-flash')
const session = require('express-session')

const app = express()

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(methodOverride('_method'))

app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}))

app.use(flash())

// Global Variables
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg')
  res.locals.error_msg = req.flash('error_msg')
  res.locals.error = req.flash('error')
  next()
})

mongoose.Promise = global.Promise
mongoose.connect('mongodb+srv://benbkk:b3NN@10120@cluster0-qsyd8.mongodb.net/vidjot', {
  useNewUrlParser: true
})
  .then(() => console.log('MongoDB is connected'))
  .catch(err => console.log(err))

// Load Idea Model
require('./models/Idea')
const Idea = mongoose.model('ideas')

// Handlebars Middleware
app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}))
app.set('view engine', 'handlebars')


// Index Route
app.get('/', (req, res) => {
  res.render('index')
})

// About Route
app.get('/about', (req, res) => {
  res.render('about')
})

// Ideas Route
app.get('/ideas', (req, res) => {
  Idea.find({})
    .sort({date: 'desc'})
    .then(ideas => {
      res.render('ideas/index', {
        ideas,
      })
    })
})

// Add Idea
app.get('/ideas/add', (req, res) => {
  res.render('ideas/add')
})

// Edit Idea
app.get('/ideas/edit/:id', (req, res) => {
  Idea.findOne({
    _id: req.params.id
  })
  .then(idea => {
    res.render('ideas/edit', {
      idea
    })
  })
})

// Process Edit Video Form

app.put('/ideas/:id', (req, res) => {
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

app.post('/ideas', (req, res) => {
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

app.delete('/ideas/:id', (req, res) => {
  Idea.remove({
    _id: req.params.id
  })
  .then(() => {
    req.flash('success_msg', 'Video idea was removed')
    res.redirect('/ideas')
  })
})

const port = 5000

app.listen(port, () => {
  console.log(`Server started on port ${port}`)
})