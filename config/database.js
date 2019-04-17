if (process.env.NODE_ENV === 'production') {
  module.exports = {
    mongoURI: 'mongodb+srv://benbkk:b3NN@10120@cluster0-qsyd8.mongodb.net/vidjot'
  }
} else {
  module.exports = {
    mongoURI: 'mongodb://localhost/vidjot'
  }
}