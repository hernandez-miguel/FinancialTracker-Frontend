import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import useMediaQuery from '@mui/material/useMediaQuery';
import { getBarChartLabels, getBarChartData } from '../helpers/networthPage.helper';
import { formatAmount, sortByYear } from '../helpers/networthPage.helper';
import useData from '../hooks/useData.hook';

const NetWorthChart = () => {
  const [year, setYear] = useState('');
  const { accountsData, balancesData } = useData();
  const { setFilteredData } = useData();
  const { setAccountsTableView } = useData();
  
  const mobileView = useMediaQuery('(max-width:600px)');
  
  const labelsList = getBarChartLabels(balancesData);

  const [barData, setBarData] = useState({
    labels: labelsList,
    datasets: [
      {
        label: 'debt',
        data: sortByYear(balancesData).map((item) => item.debt),
        backgroundColor: '#2d6a4f',
      },
      {
        label: 'investment',
        data: sortByYear(balancesData).map((item) => item.investment),
        backgroundColor: '#52b788',
      },
      {
        label: 'cash',
        data: sortByYear(balancesData).map((item) => item.cash),
        backgroundColor: '#b7e4c7',
      },
    ],
  });

  const barChartOptions = {
    responsive: true,
    aspectRatio: mobileView ? 1 : 2,
    plugins: {
      title: {
        display: true,
        text: 'Yearly net worth',
        align: 'center',
      },
    },
    scales: {
      x: {
        stacked: true,
        grid: {
          display: false,
          drawBorder: false,
        }
      },
      y: {
        stacked: true,
        grid: {
          drawBorder: false,
          color: (context) => {
            if(context.tick.value === 0) {
              return 'rgba(102, 102, 102, 0.2)';
            } else {
              return 'rgba(102, 102, 102, 0.2)';
            }
          }
        },
        ticks: {
          format: { maximumFractionDigits: 2, minimumFractionDigits: 2 },
          callback: (value, index, values) => {
            return '$' + formatAmount(value);
          },
        },
      },
    },
  };

  useEffect(() => {
    setAccountsTableView([...accountsData]);
    setFilteredData([]);
    setBarData({
      labels: labelsList,
      datasets: [
        {
          label: 'debt',
          data: sortByYear(balancesData).map((item) => item.debt),
          backgroundColor: '#2d6a4f',
        },
        {
          label: 'investment',
          data: sortByYear(balancesData).map((item) => item.investment),
          backgroundColor: '#52b788',
        },
        {
          label: 'cash',
          data: sortByYear(balancesData).map((item) => item.cash),
          backgroundColor: '#b7e4c7',
        },
      ],
    });
  }, [accountsData, balancesData]);

  return (
    <Box sx={{ width: '100%', paddingTop: 2 }}>
      <Paper sx={{ width: '100%', mb: 2, p: 1.5 }}>
        <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
          <InputLabel id="year-selector-label">Year</InputLabel>
          <Select
            labelId="year-selector-label"
            id="year-selector"
            value={year}
            onChange={(ev) => setYear(ev.target.value)}
            label="year"
          >
            <MenuItem value="">
              <em>Show all</em>
            </MenuItem>
            {sortByYear(balancesData).map((item) => {
              return (
                <MenuItem key={item.year} value={item.year}>
                  {item.year}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
        <Bar data={barData} options={barChartOptions}/>
      </Paper>
    </Box>
  );
};

export default NetWorthChart;
