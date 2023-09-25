import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import useAuth from '../hooks/useAuth.hook';
import useData from '../hooks/useData.hook';
import axios from '../api/axios';
import { NavLink } from 'react-router-dom';
import { useState } from 'react';

const LOGOUT_URL = '/logout';

function NavBar() {
  const { setAuth } = useAuth();
  const { setExpensesData, setBalancesData } = useData();
  const { setExpensesTableView } = useData();
  const { setFilteredData } = useData();
  const { setSelectedExpenses } = useData();
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  
  const pages = [
    {
      path: '/',
      name: 'Expenses'
    },
    {
      path: '/networth',
      name: 'Networth'
    },
    {
      path: '/admin',
      name: 'Admin'
    }
  ]

  const settings = ['Logout'];

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = async () => {
    setAuth('');
    setExpensesData([]);
    setBalancesData([]);
    setExpensesTableView([]);
    setSelectedExpenses([]);
    setFilteredData([]);
    const response = await axios.get(LOGOUT_URL);
  }

  return (
    <AppBar position="sticky" sx={{ overflow: 'hidden' }}>
      <Toolbar>
        <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' }}}>
          <IconButton
            size="large"
            onClick={handleOpenNavMenu}
            color="inherit"
          >
            <MenuIcon />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorElNav}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
            open={Boolean(anchorElNav)}
            onClose={handleCloseNavMenu}
            sx={{
              display: { xs: 'block', md: 'none' },
            }}
          >
            {pages.map((page) => (
              <NavLink to={page.path} key={page.name} style={{ textDecoration: 'none' }}> 
                <MenuItem onClick={handleCloseNavMenu}>
                  <Typography 
                    textAlign="center"
                    sx={{ color: 'black' }}
                  >
                    {page.name}
                  </Typography>
                </MenuItem>
              </NavLink>
            ))}
          </Menu>
        </Box>
        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex'}}}>
          {pages.map((page) => (
            <NavLink to={page.path} key={page.name} style={{ textDecoration: 'none' }}>
              <Button
                onClick={handleCloseNavMenu}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                {page.name}
              </Button>
            </NavLink>
          ))}
        </Box>
        <Box sx={{ flexGrow: 0 }}>
          <Tooltip title="Open settings">
            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0, color: 'white' }}>
              <AccountCircle />
            </IconButton>
          </Tooltip>
          <Menu
            sx={{ mt: '45px' }}
            id="menu-appbar"
            anchorEl={anchorElUser}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorElUser)}
            onClose={handleCloseUserMenu}
          >
            {settings.map((setting) => (
              setting === 'Logout' ? 
                <MenuItem key={setting} onClick={handleLogout}>
                  <Typography textAlign="center">{setting}</Typography>
                </MenuItem> :
                <MenuItem key={setting} onClick={handleCloseUserMenu}>
                  <Typography textAlign="center">{setting}</Typography>
                </MenuItem>
            ))}
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
export default NavBar;
