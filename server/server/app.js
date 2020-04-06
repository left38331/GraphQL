const express = require('express');
const graphqlHTTP = require('express-graphql');
const schema = require('../schema/schema');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = 3005;

mongoose.connect('mongodb+srv://left38331:swat38331@cluster0-4tmjb.mongodb.net/graphQL', { useNewUrlParser: true,
    useUnifiedTopology: true });

app.use(cors());

app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true
}));

const dbConnection = mongoose.connection;
dbConnection.on('error', err => console.log(`Error is is ${err}`));
dbConnection.once('open', () => console.log('Conneected to DB!'));

app.listen(PORT, err => {
   err ? console.log(onerror) : console.log('Server started!');
});
