import { Routes, Route } from "react-router-dom";
import HomePage from './Pages/HomePage';
import AdminPage from './Pages/AdminPage';
import Login from './components/layout/Login';
import Register from './components/layout/Register';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
}

export default App;