const path = require('path')
const express = require('express')
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const flash = require('connect-flash')
const session = require('express-session')

const app = express()

// Load Routes
const ideas = require('./routes/ideas')
const users = require('./routes/users')

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

// Use Routes
app.use('/ideas', ideas)
app.use('/users', users)

const port = 5000

app.listen(port, () => {
  console.log(`Server started on port ${port}`)
})