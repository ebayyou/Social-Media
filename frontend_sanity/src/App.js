import { Routes, Route } from 'react-router-dom'
import Home from './container/Home';
import LoginPage from './components/LoginPage';

function App() {
  return (
    <Routes>
      <Route path="/*" element={<Home />} />
      <Route path="login" element={<LoginPage />} />
    </Routes>
  );
}

export default App;
