import { LoginPage, RegisterPage } from './pages/index.js';
import Container from '@mui/material/Container';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import './styles/app.style.css';
import DummyPage from './pages/dummyHome.page.jsx';

function App() {
  return (
    <Container>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<DummyPage />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/register' element={<RegisterPage />} />
        </Routes>
      </BrowserRouter>
    </Container>
  );
}

export default App;