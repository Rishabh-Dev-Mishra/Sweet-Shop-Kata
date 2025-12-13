import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import './index.css'
import Login from './pages/Login';

function Home() {
  const [sweets, setSweets] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    // 1. Get the token we saved during login
    const token = localStorage.getItem('auth-token');

    // 2. Fetch with the token header
    fetch('http://localhost:5000/api/sweets', {
      headers: {
        'auth-token': token // <--- The Key to the Kingdom
      }
    })
      .then(res => {
        if (res.status === 401) throw new Error("Please Login to see sweets");
        return res.json();
      })
      .then(data => setSweets(data))
      .catch(err => setError(err.message));
  }, []);

  return (
    <div>
      <h1>Sweet Shop Inventory</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div className="sweet-grid">
        {/* If sweets is not an array (e.g. error message), don't map */}
        {Array.isArray(sweets) && sweets.map(sweet => (
          <div key={sweet._id} style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
            <h3>{sweet.name}</h3>
            <p>Price: ${sweet.price}</p>
            <p>Stock: {sweet.quantity}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <nav style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>
        <Link to="/">Home</Link> | <Link to="/login">Login</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App