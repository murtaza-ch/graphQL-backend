const express=require('express');
const graphqlHTTP=require('express-graphql');
const schema=require('./schema/schema');
const mongoose=require('mongoose');
const cors=require('cors');

const app=express();

// allow cross-origin requests
app.use(cors());

mongoose.connect('mongodb+srv://test:test@todo-oo9wu.mongodb.net/test?retryWrites=true&w=majority',{useNewUrlParser:true,useCreateIndex:true,useFindAndModify:false,useUnifiedTopology:true});
mongoose.connection.once('open',()=>{
    console.log('Connected to database...');
})

app.use('/graphql',graphqlHTTP({
   schema:schema,
   graphiql:true
}));

app.listen(4000,()=>{
    console.log('now listening for requests on port 4000');
})