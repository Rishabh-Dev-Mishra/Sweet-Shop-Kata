import { useState, useEffect } from 'react'

function App() {
  const [sweets, setSweets] = useState([]);

  useEffect(() => {
    // Fetch data from your backend
    fetch('http://localhost:5000/api/sweets')
      .then(res => res.json())
      .then(data => setSweets(data))
      .catch(err => console.error("Error fetching sweets:", err));
  }, []);

  return (
    <div className="App">
      <h1>Sweet Shop Inventory</h1>
      <div className="sweet-grid">
        {sweets.map(sweet => (
          <div key={sweet._id} style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
            <h3>{sweet.name}</h3>
            <p>Category: {sweet.category}</p>
            <p>Price: ${sweet.price}</p>
            <p>Stock: {sweet.quantity}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App