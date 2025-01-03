import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';

const modules = ['Dashboard', 'Maestros', 'Detalles'];

function ResponsiveAppBar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Logic for logout, e.g., clearing auth tokens, etc.
    navigate('/login');
  };


  return (
    <AppBar position="static" sx={{ height: '80px', justifyContent: 'center' }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h4"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            PARAMAN BARBERIAS
          </Typography>

          <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            {modules.map((module) => (
              <Button
                key={module}
                onClick={() => navigate(`/${module.toLowerCase().replace(/ /g, '-')}`)}
                sx={{ my: 2, color: 'white', display: 'block', fontSize: '16px' }}
              >
                {module}
              </Button>)) }
              <Button
              onClick={handleLogout}
              sx={{ my: 2, color: 'white', display: 'block', fontSize: '16px' }}
            >
              Salir
            </Button>
           
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default ResponsiveAppBar;

