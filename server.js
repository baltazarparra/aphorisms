import express, { response } from 'express'
import dotenv from 'dotenv'
import path from 'path'
import mongo from 'mongodb'

dotenv.config()

const mongoClient = mongo.MongoClient
const ObjectId = mongo.ObjectID

const __dirname = path.resolve()
const app = express()

mongoClient.connect(process.env.DB_URL, { useUnifiedTopology: true})
    .then(client => {
        console.log('Connected')
        const db = client.db('aphorisms')
        const quotes = db.collection('quotes')
        
        app.set('view engine', 'ejs')
        app.use(express.urlencoded({ extended: true }))
        app.use(express.static('public'))
        app.use(express.json())

        app.get('/', (request, response) => {
            db.collection('quotes').find().toArray()
                .then(results => {
                    response.render('index.ejs', { quotes: results })
                })
                .catch(error => console.log(error))
        })

        app.post('/quotes', (request, response) => {
            quotes.insertOne(request.body)
                .then(() => response.redirect('/'))
                .catch(error => console.error(error))
        })

        app.put('/quotes', (request, response) => {
            quotes.findOneAndUpdate(
                    { _id: ObjectId(request.body.id) },
                    { $set: { quote: request.body.quote } },
                    { upsert: true }
                )
                    .then(result => response.json('Success'))
                    .catch(error => console.error(error))
        })

        app.delete('/quotes', (request, response) => {
            quotes.deleteOne({ _id: ObjectId(request.body.id) })
                .then(() => response.redirect('/'))
                .catch(error => console.error(error))
        })

        app.listen(3000, () => console.log('listing on 3k...'))

    })
    .catch(error => console.error(error))