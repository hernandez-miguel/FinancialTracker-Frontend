import { LoginPage, RegisterPage } from './pages/index.js';
import Container from '@mui/material/Container';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import './styles/app.style.css';

function App() {
  return (
    <Container sx={{border: '1px solid blue'}}>
      <BrowserRouter>
        <Routes>
          <Route path='/login' element={<LoginPage />} />
          <Route path='/register' element={<RegisterPage />} />
        </Routes>
      </BrowserRouter>
    </Container>
  );
}

export default App;
