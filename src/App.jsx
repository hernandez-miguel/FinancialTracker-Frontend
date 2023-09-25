import { LoginPage, RegisterPage, ExpensesPage } from './pages/index.js';
import { NetWorthPage, AdminPage } from './pages/index.js';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthProvider.jsx';
import { DataProvider } from './context/DataProvider.jsx';
import RequireAuth from './components/RequireAuth.jsx';
import Layout from './components/Layout.jsx';
import './styles/app.style.css';

function App() {

  return (
    <BrowserRouter>
      <AuthProvider>
          <DataProvider>
            <Routes>
              <Route path='/' element={<Layout />}>
                {/*public routes*/}
                <Route path='/login' element={<LoginPage />} />
                <Route path='/register' element={<RegisterPage />} />
                {/* <Route path='/unauthorized' element={<UnauthPage />} /> */}

                {/*protected routes*/}
                <Route element={<RequireAuth allowedRoles={[2001]}/>}>
                  <Route path='/' element={<ExpensesPage />} />
                </Route>
                <Route element={<RequireAuth allowedRoles={[2001]}/>}>
                  <Route path='/networth' element={<NetWorthPage />} />
                </Route>
                <Route element={<RequireAuth allowedRoles={[5150]}/>}>
                  <Route path='/admin' element={<AdminPage />} />
                </Route>/
              </Route>
            </Routes>
        </DataProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;