const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')

const app = express()

mongoose.connect('mongodb+srv://benbkk:b3NN@10120@cluster0-qsyd8.mongodb.net/vidjot?retryWrites=true', {
  useNewUrlParser: true
})
  .then(() => console.log('MongoDB is connected'))
  .catch(err => console.log(err))

// Load Idea Model
require('./models/Idea')
const Idea = mongoose.model('idea')

// Handlebars Middleware
app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}))
app.set('view engine', 'handlebars')

app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, 'public')))

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
  res.render('ideas')
})

// Add Ideas
app.get('/ideas/add', (req, res) => {
  res.render('ideas/add')
})

// Process Add Video Form
app.post('/ideas', (req, res) => {
  let errors = []
  if (!req.body.title) {
    errors.push({
      text: 'Title is required'
    })
  }
  if (!req.body.details) {
    errors.push({
      text: 'Details is required'
    })
  }
  if (errors.length > 0) {
    res.render('ideas/add', {
      errors,
      title: req.body.title,
      details: req.body.details
    })
  } else {
    res.send('Passed')
  }
})

const port = 5000

app.listen(port, () => {
  console.log(`Server started on port ${port}`)
})