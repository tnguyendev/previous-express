const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient

var db, collection;

const url = "mongodb+srv://thaonguyen:pafW5wI449rrBO5q@tnguyendev.ix5ze.mongodb.net/todolist?retryWrites=true&w=majority";
const dbName = "messages";

app.listen(7000, () => {
    MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (error, client) => {
        if (error) {
            throw error;
        }
        db = client.db(dbName);
        console.log("Connected to `" + dbName + "`!");
    });
});

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(express.static('public'))

app.get('/', (req, res) => {
    db.collection('tasks').find().toArray((err, result) => {
        if (err) return console.log(err)
        console.log(result)
        res.render('index.ejs', { tasks: result })
    })
})

app.post('/addTask', (req, res) => {
    db.collection('tasks').insertOne({
        task: req.body.task,
        completed: false
    }, (err, result) => {
        if (err) return console.log(err)
        console.log('saved to database')
        res.redirect('/')
    })
})

app.put('/editTask', (req, res) => {
    console.log(req.body)
    db.collection('tasks')

        .findOneAndUpdate({ task: req.body.task, completed: false }, {

            $set: {
                completed: true
            }
        }, {
            sort: { _id: -1 },
            upsert: false
        }, (err, result) => {
            if (err) return res.send(err)
            res.send(result)
        })
})

app.delete('/deletelist', (req, res) => {
    db.collection('tasks').deleteMany({ }, (err, result) => {
        if (err) return res.send(500, err)
        res.send('Message deleted!')
    })
})