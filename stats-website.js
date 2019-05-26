const admin = require('firebase-admin');
const express = require('express');
const hbs = require('hbs');

var serviceAccount = require("C://Users//swetha guptha//Desktop//Elite//acms//elections-37945-firebase-adminsdk-q5z8n-6d908ba9e5.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "elections-37945.appspot.com"
});

var firestore = admin.firestore();
var Storage=admin.storage();
// console.log('storage '+Object.getOwnPropertyNames(bucket));

const port = 3003;
var app = express();
app.use(express.static(__dirname + '/public'));//will not load the static files on giving the path to it if absent.
app.use(express.urlencoded())

hbs.registerPartials(__dirname + '/views/partials')
app.set('view engine', 'hbs');
var Handlebars = require('hbs');

app.listen(port, () => {
    console.log(`Server is up on port ${port}`);
  });

require('./stats.js')(app,firestore);
  app.get('/',(req,res)=>{
    console.log(__dirname);
     res.sendFile(__dirname+'/public/stats.html');
})
app.get('/const',async (req,res)=>{
    console.log("getting list of constituencies");
    var constlist = new Array();
          var query = firestore.collection("Election_Day");
          await query.get().then(function (querySnapshot) {
            // check and do something with the data here.
            if (querySnapshot.empty) {
              console.log('No stats');
              res.send('no documents found');
            }
            querySnapshot.forEach(async function (documentSnapshot) {
              console.log("getting constituency name");
              var data=documentSnapshot.id;
              constlist.push(data);
              console.log(data);
              });
          });
          console.log(constlist);
          res.send({response:constlist});
  });
