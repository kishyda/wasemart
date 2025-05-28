"use client";
import { useEffect, useState } from 'react';

export default function AuthCheckPage() {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchAuthData = async () => {
      try {
          const response = await fetch(`https://wasemartbackend.loca.lt/authcookie`, {
              method: 'GET',
          credentials: 'include', // Include cookies
          headers: {
              'Content-Type': 'application/json',
          },
          });

          const result = await response.json();

          if (!response.ok) {
              throw new Error(result?.error || 'Failed to fetch');
          }

          setData(result);
      } catch (err: any) {
          setError(err.message);
      }
  };

  fetchAuthData();

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Auth Cookie Status</h1>
      <button onClick={fetchAuthData}>Send auth cookie</button>
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      {data ? (
        <pre>{JSON.stringify(data, null, 2)}</pre>
      ) : (
        !error && <p>Loading...</p>
      )}
    </div>
  );
}

