import { Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth.hook";
import Container from '@mui/material/Container';
import NavBar from './NavBar';

const Layout = () => {
  const { auth } = useAuth();
  return (
    <> 
    {
      auth?.email &&
        <NavBar />
    }
      <Container> 
        <Outlet />
      </Container>
    </>
  )
}

export default Layout;