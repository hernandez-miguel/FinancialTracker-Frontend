import { useEffect } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import useData from '../hooks/useData.hook';

const NetWorthChart = () => {
  const { netWorthData } = useData();
  const { setNetWorthTableView } = useData();

  useEffect(() => {
    setNetWorthTableView([...netWorthData]);
  }, [netWorthData]);

  return (
    <Box sx={{ width: '100%', paddingTop: 2 }}>
      <Paper sx={{ width: '100%', mb: 2, p: 1.5 }}>
        <h1>test</h1>
      </Paper>
    </Box>
  );
};

export default NetWorthChart;