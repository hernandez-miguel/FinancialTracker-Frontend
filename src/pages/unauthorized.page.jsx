import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const UnauthorizedPage = () => {
  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Typography variant='h6'>401 | Unauthorized</Typography>
    </Box>
  );
};

export default UnauthorizedPage;
