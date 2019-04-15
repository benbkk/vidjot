const path = require('path')
const express = require('express')
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')

const app = express()


app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static(path.join(__dirname, 'public')))

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

// Add Ideas
app.get('/ideas/add', (req, res) => {
  res.render('ideas/add')
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
        res.redirect('/ideas')
      })
  }
})

const port = 5000

app.listen(port, () => {
  console.log(`Server started on port ${port}`)
})