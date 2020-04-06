const graphql = require('graphql');

const { GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLID, GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLBoolean } = graphql;

const Movies = require('../models/movie');
const Directors = require('../models/director');



const MovieType = new GraphQLObjectType({
    name: 'Movie',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLNonNull(GraphQLString) },
        genre: { type: GraphQLNonNull(GraphQLString) },
        rate: { type: GraphQLInt },
        watched: { type: GraphQLNonNull(GraphQLBoolean) },
        director: {
            type: DirectorType,
            resolve(parent, args) {
                return Directors.findById(parent.directorId);
            }
        }
    }),
});

const DirectorType = new GraphQLObjectType({
    name: 'Director',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLNonNull(GraphQLString) },
        age: { type: GraphQLNonNull(GraphQLInt) },
        movies: {
            type: new GraphQLList(MovieType),
            resolve(parent, args) {
                return Movies.find({ directorId: parent.id});
            }
        }
    }),
});

const Mutation = new GraphQLObjectType({
   name: 'Mutation',
   fields: {
       addDirector: {
           type: DirectorType,
           args: {
               name: { type: GraphQLNonNull(GraphQLString) },
               age: { type: GraphQLNonNull(GraphQLInt) },
           },
           resolve(parent, args) {
               const director = new Directors({
                   name: args.name,
                   age: args.age
               });
               return  director.save();
           }
       },
       addMovie: {
           type: MovieType,
           args: {
               name: { type: GraphQLNonNull(GraphQLString) },
               genre: { type: GraphQLNonNull(GraphQLString) },
               directorId: { type: GraphQLID},
               rate: { type: GraphQLInt },
               watched: { type: GraphQLNonNull(GraphQLBoolean) },
           },
           resolve(parent, args) {
               const movie = new Movies({
                   name: args.name,
                   genre: args.genre,
                   directorId: args.directorId,
                   watched: args.watched,
                   rate: args.rate
               });
               return  movie.save();
           }
       },
       deleteDirector: {
           type: DirectorType,
           args: { id: { type: GraphQLID} },
           resolve(parent, args) {
               return Directors.findByIdAndRemove(args.id);
           }
       },
       deleteMovie: {
           type: MovieType,
           args: { id: { type: GraphQLID} },
           resolve(parent, args) {
               return Movies.findByIdAndRemove(args.id);
           }
       },
       updateDirector: {
           type: DirectorType,
           args: {
               id: { type: GraphQLID },
               name: { type: GraphQLNonNull(GraphQLString) },
               age: { type: GraphQLNonNull(GraphQLInt) }
           },
           resolve(parent, args) {
               return  Directors.findByIdAndUpdate(
                   args.id,
                   { $set: { name: args.name, age: args.age } },
                   { new: true }
               );
           }
       },
       updateMovie: {
           type: MovieType,
           args: {
               id: { type: GraphQLID },
               name: { type: GraphQLNonNull(GraphQLString) },
               genre: { type: GraphQLNonNull(GraphQLString) },
               directorId: { type: GraphQLID },
               rate: { type: GraphQLInt },
               watched: { type: GraphQLNonNull(GraphQLBoolean) },
           },
           resolve(parent, args) {
               return  Movies.findByIdAndUpdate(
                   args.id,
                   { $set: { name: args.name, genre: args.genre, directorId: args.directorId, watched: args.watched, rate: args.rate } },
                   { new: true }
               );
           }
       },
   }
});

const Query = new GraphQLObjectType({
    name: 'Query',
    fields: {
        movie: {
            type: MovieType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return Movies.findById(args.id);
            }
        },
        director: {
            type: DirectorType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return Directors.findById(args.id);
            }
        },
        movies: {
            type: new GraphQLList(MovieType),
            args: { name: { type: GraphQLString } },
            resolve(parent, { name }) {
                return Movies.find({ name: { $regex: name, $options: "i" } });
            }
        },
        directors: {
            type: new GraphQLList(DirectorType),
            args: { name: { type: GraphQLString } },
            resolve(parent, { name }) {
                return Directors.find({ name: { $regex: name, $options: "i" } });
            }
        }
    }
});

module.exports = new GraphQLSchema ({
    query: Query,
    mutation: Mutation
});

