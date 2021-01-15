import React from 'react';
import ReactDOM from 'react-dom';
import {
  ApolloClient,
  createHttpLink,
  from,
  InMemoryCache,
} from '@apollo/client';
import { ApolloProvider } from '@apollo/react-hooks';
import { setContext } from '@apollo/client/link/context';
import { TokenRefreshLink } from 'apollo-link-token-refresh';
import jwtDecode, { JwtPayload } from 'jwt-decode';
import { getAccessToken, setAccessToken } from './accessToken';
import App from './App';

const URL = process.env.REACT_APP_URL || 'http://localhost:4000';

const tokenRefreshLink = new TokenRefreshLink({
  accessTokenField: 'accessToken',
  isTokenValidOrUndefined: () => {
    const token = getAccessToken();
    if (!token) {
      return true;
    }
    try {
      const { exp } = jwtDecode<JwtPayload>(token);
      if (Date.now() >= exp! * 1000) {
        return false;
      } else {
        return true;
      }
    } catch (err) {
      return false;
    }
  },
  fetchAccessToken: () => {
    return fetch(`${URL}/refresh_token`, {
      method: 'POST',
      credentials: 'include',
    });
  },
  handleFetch: (accessToken) => {
    setAccessToken(accessToken);
  },
  handleError: (err) => {
    console.warn('Refresh token invalid, try logging in again');
    console.log(err);
  },
});

const httpLink = createHttpLink({
  uri: `${URL}/graphql`,
  credentials: 'include', // don't put this line inside of ApolloClient!
});

const authLink = setContext((_, { headers }) => {
  const accessToken = getAccessToken();

  if (accessToken) {
    return {
      headers: {
        ...headers,
        authorization: accessToken ? `Bearer ${accessToken}` : '',
      },
    };
  }
});

const client = new ApolloClient({
  link: from([tokenRefreshLink, authLink, httpLink]),
  cache: new InMemoryCache(),
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </ApolloProvider>,
  document.getElementById('root')
);
