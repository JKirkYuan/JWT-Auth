import React from 'react';
import { useUsersQuery } from '../generated/graphql';

interface HomeProps {}

export const Home: React.FC<HomeProps> = () => {
  const { data } = useUsersQuery({ fetchPolicy: 'network-only' });
  if (!data) {
    return <div>loading...</div>;
  }
  return (
    <>
      <h2>Home Page</h2>

      <div>
        <ul>
          {data.users.map((user) => (
            <li key={user.id}>
              {user.email}, {user.id}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};
