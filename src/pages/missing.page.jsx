import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const MissingPage = () => {
  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Typography variant='h6'>404 | Page not found.</Typography>
    </Box>
  );
};

export default MissingPage;
