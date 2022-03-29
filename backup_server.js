const express = require('express')
const bodyParser= require('body-parser')
const app = express()
const MongoClient = require('mongodb').MongoClient

// Make sure you place body-parser before your CRUD handlers!
app.use(bodyParser.urlencoded({ extended: true }))

app.set('view engine', 'ejs')


connectionString = 'mongodb+srv://jake1:install4@cluster0.djq8r.mongodb.net/admin?retryWrites=true&w=majority'


var db
var quotesCollection

MongoClient.connect(connectionString, { useUnifiedTopology: true })
  .then(client => {
    console.log('Connected to Database')
    db = client.db('star-wars')
    quotesCollection = db.collection('quotes')
  })




app.listen(8081, function() {
  console.log('listening on 8081')
})



app.get('/', (req, res) => {
  db.collection('quotes').find().toArray()
    .then(results => {
      res.render('index.ejs', { quotes: results })
    })
    .catch(/* ... */)
})



app.post('/quotes', (req, res) => {
  quotesCollection.insertOne(req.body)
    .then(result => {
      console.log(result)
      res.redirect('/')
    })
    .catch(error => console.error(error))
})






