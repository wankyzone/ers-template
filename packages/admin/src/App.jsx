import { useEffect, useState } from "react";
import React from "react";

export default function App() {
  const [errands, setErrands] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/errands")
      .then((res) => res.json())
      .then((data) => setErrands(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div style={{ padding: 40 }}>
      <h1>ERS Admin Dashboard</h1>

      <h2>Errands</h2>
      <pre>{JSON.stringify(errands, null, 2)}</pre>
    </div>
  );
}
