import React from "react";
import { gql, useQuery } from "@apollo/client";
const query = gql`
  query GetTodosWithUser {
    getTodos {
      id
      title
      completed
      user {
        id
        name
      }
    }
  }
`;

const App = () => {
  const { data, loading } = useQuery(query);
  if (loading) return <h1>Loading...</h1>;
  return <div>{JSON.stringify(data)}</div>;
};

export default App;
