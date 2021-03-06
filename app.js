const path = require('path')
const express = require('express')
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const flash = require('connect-flash')
const passport = require('passport')
const session = require('express-session')

const app = express()

const db = require('./config/database')

// Load Routes
const ideas = require('./routes/ideas')
const users = require('./routes/users')

// Passport Config
require('./config/passport')(passport)

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(methodOverride('_method'))

// Connect to Mongoose
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}))

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

app.use(flash())

// Global Variables
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg')
  res.locals.error_msg = req.flash('error_msg')
  res.locals.error = req.flash('error')
  res.locals.user = req.user || null
  next()
})

mongoose.Promise = global.Promise
mongoose.connect(db.mongoURI, {
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

const port = process.env.PORT || 5000

app.listen(port, () => {
  console.log(`Server started on port ${port}`)
})