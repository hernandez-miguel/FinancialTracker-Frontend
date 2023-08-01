import { LoginPage } from './pages/index.js';
import {Container} from '@mui/material'
import './styles/app.style.css';

function App() {
  return (
    <Container sx={{border: '1px solid blue'}}>
      <LoginPage />
    </Container>
  );
}

export default App;
