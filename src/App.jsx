import Container from '@mui/material/Container';
import { LoginPage, RegisterPage } from './pages/index.js';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthProvider.jsx';
import RequireAuth from './components/RequireAuth.jsx';
import Layout from './components/Layout.jsx';

import './styles/app.style.css';
import DummyPage from './pages/dummyHome.page.jsx';
import UnauthPage from './pages/dummyUnauth.page.jsx';

function App() {
  return (
    <Container>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path='/' element={<Layout />}>
              {/*public routes*/}
              <Route path='/login' element={<LoginPage />} />
              <Route path='/register' element={<RegisterPage />} />
              <Route path='/unauthorized' element={<UnauthPage />} />

              {/*protected routes*/}
              <Route element={<RequireAuth allowedRoles={[2001]}/>}>
                <Route path='/' element={<DummyPage />} />
              </Route>

              {/*<Route element={<RequireAuth allowedRoles={[5150]}/>}>
                <Route path='/admin' element={<AdminPage />} />
              </Route>/*/}
            </Route>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </Container>
  );
}

export default App;