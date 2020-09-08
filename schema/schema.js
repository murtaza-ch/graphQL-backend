const graphql=require('graphql');
const _ = require('lodash');
const Book=require('../models/book');
const Author=require('../models/author');

// const books=[
//     {name:'Name of the wind',genre:'Fantasy',id:'1',authorId:'1'},
//     {name:'The final Empire',genre:'Fantasy',id:'2',authorId:'2'},
//     {name:'The long Earth',genre:'Sci-fi',id:'3',authorId:'3'},
//     {name:'The Light Fantastic',genre:'fantasy',id:'6',authorId:'3'}
// ];

// const authors=[
//     {name:'Ali',age:20,id:'1'},
//     {name:'Ahmad',age:30,id:'2'},
//     {name:'Arish',age:40,id:'3'},
// ]

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLSchema,
    GraphQLID,
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull
    }=graphql;



const BookType= new GraphQLObjectType({
    name:'Book',
    fields:()=>({
        id:{type:GraphQLID},
        name:{type:GraphQLString},
        genre:{type:GraphQLString},
        author:{
            type:AuthorType,
            resolve(parent,args){
                //return _.find(authors,{id:parent.authorId});
                return Author.findById(parent.authorId);
            }
        }
    })
});



const AuthorType= new GraphQLObjectType({
    name:'Author',
    fields:()=>({
        id:{type:GraphQLID},
        name:{type:GraphQLString},
        age:{type:GraphQLInt},
        books:{
            type:new GraphQLList(BookType),
            resolve(parent,args){
               // return _.filter(books, {authorId:parent.id});
               return Book.find({authorId:parent.id});
            }
        }
    })
});


const RootQuery = new GraphQLObjectType({
    name:'RootQueryType',
    fields:{
        book:{
            type:BookType,
            args:{id:{type:GraphQLID}},
            resolve(parent,args){
                // code to get data from db/other source
                // return _.find(books,{id:args.id});
                return Book.findById(args.id);
            }
        },
        author:{
            type:AuthorType,
            args:{id:{type:GraphQLID}},
            resolve(parent,args){
                // return _.find(authors,{id:args.id});
                return Author.findById(args.id);
            }
        },
        books:{
            type:new GraphQLList(BookType),
            resolve(parent,args){
                // return books
                return Book.find({});
            }
        },
        authors:{
            type:new GraphQLList(AuthorType),
            resolve(parent,args){
                // author
                return Author.find({});
            }
        }
    }
});

const Mutation=new GraphQLObjectType({
    name:'Mutation',
    fields:{
        addAuthor:{
            type:AuthorType,
            args:{
                name:{type:new GraphQLNonNull(GraphQLString)},
                age:{type:new GraphQLNonNull(GraphQLInt)}
            },
        resolve(parent,args){
            let author=new Author({
                name:args.name,
                age:args.age
            });
            return author.save();
        }
    },
    addBook:{
        type:BookType,
        args:{
            name:{type:new GraphQLNonNull(GraphQLString)},
            genre:{type:new GraphQLNonNull(GraphQLString)},
            authorId:{type:new GraphQLNonNull(GraphQLID)}
        },
        resolve(parent,args){
            let book=new Book({
                name:args.name,
                genre:args.genre,
                authorId:args.authorId
            });
            return book.save();
        }
    }
    }
})

module.exports=new GraphQLSchema({
    query:RootQuery,
    mutation:Mutation
})