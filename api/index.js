const express = require('express');
const Firestore = require('@google-cloud/firestore');

const db = new Firestore();
const app = express();

app.use(express.json());
const port = process.env.PORT || 8081;

app.listen(port, () => {
    console.log('Daquiri REST API is listening on port 8081');
});

/// Root Directory
app.get('/', async (req, res) => {
    res.json({status: 'Daquiri is served.'});
});

/// All movies endpoint
app.get('/movies', async (req, res) => {
    var output = 
    db.collection("movies").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            console.log(doc.id, " => ", doc.data());
            var movies = querySnapshot.docs.map(doc => doc.data());
            res.status(200).json(movies);
        });
    });
    return output;
});

/// Filter by category
app.get('/:category', async (req, res) => {
    const category = req.params.category;
    const query = db.collection('movies').where('category', '==', category);
    const querySnapshot = await query.get();
    if (querySnapshot.size > 0) {
        var movies = querySnapshot.docs.map(doc => doc.data());
        res.status(200).json(movies);
    }
    else {
        res.json({status: 'Not found!'});
    }
});