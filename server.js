const express = require('express')
const bodyParser= require('body-parser')
const app = express()
const http = require('http');
const url = require('url');
const MongoClient = require('mongodb').MongoClient
const hash = require('object-hash');
// Make sure you place body-parser before your CRUD handlers!
app.use(bodyParser.urlencoded({ extended: true }))

app.set('view engine', 'ejs')



//db-----------------------
connectionString = 'mongodb+srv://jake1:notinstall4password@cluster0.djq8r.mongodb.net/admin?retryWrites=true&w=majority'


var db
var quotesCollection

MongoClient.connect(connectionString, { useUnifiedTopology: true })
  .then(client => {
    console.log('Connected to Database')
    db = client.db('star-wars')
    quotesCollection = db.collection('quotes')
  })
//-----------------------



app.listen(8081, function() {
  console.log('listening on 8081')
})



/*var o = db.collection('quotes').find({'hash':queryObject['q1']}).toArray().then(results => {
      console.log(results)
    })
    .catch()*/

app.get('/', (req, res) => {
  //console.log(req.query)
  //console.log(url.parse(req.url))
  //const queryObject = url.parse(req.url,true).query;
  const queryObject = req.query


  if (queryObject.hasOwnProperty('q1')){
  	res.render('structureHtml.ejs', { jsfile: 'js/structure.js?q1='+queryObject["q1"] })
  }else{
  	res.render('structureHtml.ejs', { jsfile: 'js/structure.js' })
  }

})


app.get('/js/structure.js',function(req,res){
  //const queryObject = url.parse(req.url,true).query;
  const queryObject = req.query


  var defaultStartingInfo = {
		  'gender' : 'men',
		  'bodyWeight' : 120,
		  'lifts' : ['squat','bench-press','deadlift'],
		  'weights' : [200,100,300]
	  }

  if (queryObject.hasOwnProperty('q1')){

    db.collection('quotes').find({'hash':queryObject['q1']}).toArray().then(results => {
      if (results.length > 0){
  	    res.render('structureJs.ejs', { startingInfo: JSON.stringify(results[0]) })
  	  }else{
  	  	res.render('structureJs.ejs', { startingInfo: JSON.stringify(defaultStartingInfo)})
  	  }
    })
    .catch()

  }else{
  	res.render('structureJs.ejs', { startingInfo: JSON.stringify(defaultStartingInfo)})
  }




});

app.get('/logo.png', function(req,res){
  res.sendFile(__dirname+'/logo.png')
})


app.get('/js/merge.json',function(req,res){
  res.sendFile(__dirname + '/merge.json')
});




  //console.log(req.body)
  //console.log(hash(req.body))
  //res.send({'status':'ok'})

app.post('/save', (req, res) => {
  req.body["hash"] = hash(req.body)
  console.log(req.body)
  quotesCollection.update(req.body,req.body,{upsert:true})
    .then(result => {
      //console.log(result)
      res.send({'hash':req.body["hash"]})
    })
    .catch(error => console.error(error))
})
