import React, { useState, useEffect } from 'react';
import { setAccessToken } from './accessToken';
import { Routes } from './Routes';

interface AppProps {}

const App: React.FC<AppProps> = () => {
  const [loading, setLoading] = useState(true);

  const URL = process.env.REACT_APP_URL || 'http://localhost:4000';

  useEffect(() => {
    fetch(`${URL}/refresh_token`, {
      method: 'POST',
      credentials: 'include',
    }).then(async (x) => {
      const data = await x.json();
      console.log(data);
      setAccessToken(data.accessToken);
      setLoading(false);
    });
  }, [URL]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return <Routes />;
};

export default App;
