import React, { useState, useEffect } from 'react';
import { setAccessToken } from './accessToken';
import { Routes } from './Routes';

interface AppProps {}

const App: React.FC<AppProps> = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://jwtappo.herokuapp.com/refresh_token', {
      method: 'POST',
      credentials: 'include',
    }).then(async (x) => {
      const { accessToken } = await x.json();
      setAccessToken(accessToken);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return <Routes />;
};

export default App;
