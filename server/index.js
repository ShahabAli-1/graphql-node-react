const express = require("express");

const { ApolloServer } = require("@apollo/server");

const bodyParser = require("body-parser");

const cors = require("cors");

const { expressMiddleware } = require("@apollo/server/express4");
const { default: axios } = require("axios");

async function startServer() {
  const app = express();
  //   ! means required fields
  //    query for getting something from gql server
  // mutation for giving something to gql server
  const server = new ApolloServer({
    typeDefs: `
        type User {
            id:ID!
            name: String!
            username: String!
            email: String!
            phone: String!
            website: String!
        }

        type Todo {
            id: ID!,
            title:String!
            userId:ID!
            completed: Boolean
            user:User
        }

        type Query {
            getTodos: [Todo]
            getAllUsers: [User]
            getUser(id:ID!): User
        }
    `,
    resolvers: {
      Todo: {
        user: async (todo) =>
          (
            await axios.get(
              `https://jsonplaceholder.typicode.com/users/${todo.userId}`
            )
          ).data,
      },
      Query: {
        getTodos: async () =>
          (await axios.get("https://jsonplaceholder.typicode.com/todos")).data,
        getAllUsers: async () =>
          (await axios.get("https://jsonplaceholder.typicode.com/users")).data,
        getUser: async (parent, { id }) =>
          (await axios.get(`https://jsonplaceholder.typicode.com/users/${id}`))
            .data,
      },
    },
  });
  app.use(bodyParser.json());
  app.use(
    cors({
      origin: "*",
    })
  );
  await server.start();
  app.use("/graphql", expressMiddleware(server));

  app.listen(8000, () => console.log("Server started at port: ", 8000));
}

startServer();
