import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import "./index.css"
import { BrowserRouter } from 'react-router-dom';

import reportWebVitals from './reportWebVitals';
import { ApolloProvider, Cache, createHttpLink} from '@apollo/client';
import { ApolloClient } from '@apollo/client';
import { InMemoryCache } from '@apollo/client';
import{ setContext } from "@apollo/client/link/context"

const httpLink =createHttpLink({
  uri:"http://localhost:4000/graphql",
})
const authLink = setContext((_,{headers})=>{
  const token = localStorage.getItem("token");
  return {
    headers:{
      ...headers,
      authorization:token,
    }
  }
})
//上面的这些步骤实现手动拿到token


const client = new ApolloClient({
  link:authLink.concat(httpLink),
  // uri:"http://localhost:4000/graphql",
  // 文档规定这么写 上面的是graphql的地址
  cache:new InMemoryCache()
})
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
    <ApolloProvider client={client}>
      <App />
      </ApolloProvider>
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();