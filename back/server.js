const express = require ('express')
const {MongoClient, ObjectID} = require ('mongodb')
const bodyParser = require ('body-parser')
const assert = require ('assert')

const app = express()



app.use(bodyParser.json())
 const mongo_url = 'mongodb://localhost:27017'
 const dataBase = 'contactList'

MongoClient.connect(mongo_url, (err,client)=>{
    assert.equal(err,null,'Data Base connexion failed')
    const db = client.db(dataBase)

    app.post('/new_contact', (req,res)=>{
        let newcont = req.body
        db.collection('contact').insertOne(
            newcont , (err,data)=>{
                if (err) res.send('cant add contact')
                else res.send('contact was added')
            }
        )
    })

    app.get('/contacts', (req , res)=>{
        db.collection('contact').find().toArray((err , data) => {
            if (err) res.send('cant fetch contact')
            else res.send(data)
        })
    })


    
    app.get('/contacts/:id', (req , res)=>{
        let searchedCont= ObjectID(req.params.id)
        db.collection('contact').findOne({_id :searchedCont},(err , data) => {
            if (err) res.send('cant fetch contact')
            else res.send(data)
        })
    })


    app.put('/modify_contact/:id', (req , res)=>{
        let idContact = ObjectID(req.params.id)
        let modifiedContact = req.body
        db.collection('contact').findOneAndUpdate({_id : idContact}, {$set:{...modifiedContact}}, (err,data)=>{
          (err) ? res.send('cant update') : res.send(data)
        })
        
    })

    app.delete('/delete_contact/:id', (req , res)=>{
        let contactToRemovedId = ObjectID(req.params.id)
        db.collection('contact').findOneAndDelete({_id : contactToRemovedId},(err,data)=>{
            if (err) res.send('cant delete contact')
            else res.send('contact was deleted')
        })

    })
})




app.listen(4000,(err)=>{
    if (err) console.log('server erreur')
    else console.log('server is running')
})