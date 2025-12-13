import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home'; 
import AddSweet from './pages/AddSweet';
import EditSweet from './pages/EditSweet';
import MyOrders from './pages/MyOrders';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Home />} />
        <Route path="/add" element={<AddSweet />} />
        <Route path="/edit/:id" element={<EditSweet />} />
        <Route path="/orders" element={<MyOrders />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App