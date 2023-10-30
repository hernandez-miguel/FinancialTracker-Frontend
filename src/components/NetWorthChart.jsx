import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { getBarChartLabels } from '../helpers/networthPage.helper';
import { formatAmount, sortByYear } from '../helpers/networthPage.helper';
import { getYearlyNetworth, getCurrentNetworth } from '../helpers/networthPage.helper';
import useData from '../hooks/useData.hook';

const NetWorthChart = () => {
  const [currentNetworth, setCurrentNetworth] = useState(0);

  const { accountsData, balancesData } = useData();
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
        order: 1
      },
      {
        label: 'Investment',
        data: sortByYear(balancesData).map((item) => item.investment),
        backgroundColor: '#52b788',
        order: 1
      },
      {
        label: 'Cash',
        data: sortByYear(balancesData).map((item) => item.cash),
        backgroundColor: '#b7e4c7',
        order: 1
      },
      {
        label: 'Networth',
        data: getYearlyNetworth(balancesData).map((item) => item),
        borderColor: 'yellow',
        backgroundColor: 'yellow',
        type: 'line',
        order: 0
      }
    ],
  });

  const barChartOptions = {
    responsive: true,
    aspectRatio: mobileView ? 1 : 2,
    plugins: {
      title: {
        display: true,
        text: 'Yearly Networth',
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
    setCurrentNetworth(getCurrentNetworth(balancesData));
    setBarData({
      labels: labelsList,
      datasets: [
        {
          label: 'Debt',
          data: sortByYear(balancesData).map((item) => item.debt),
          backgroundColor: '#2d6a4f',
          order: 1
        },
        {
          label: 'Investment',
          data: sortByYear(balancesData).map((item) => item.investment),
          backgroundColor: '#52b788',
          order: 1
        },
        {
          label: 'Cash',
          data: sortByYear(balancesData).map((item) => item.cash),
          backgroundColor: '#b7e4c7',
          order: 1
        },
        {
          label: 'Networth',
          data: getYearlyNetworth(balancesData).map((item) => item),
          borderColor: '#ffd60a',
          backgroundColor: '#ffd60a',
          type: 'line',
          order: 0
        }
      ],
    });
  }, [accountsData, balancesData]);

  return (
    <Box sx={{ width: '100%', paddingTop: 2 }}>
      <Paper sx={{ width: '100%', mb: 2, p: 1.5, textAlign: 'center' }}>
        { accountsData.length > 0 ? (
          <>
            <Bar data={barData} options={barChartOptions}/>
            <Typography marginTop={'25px'} variant="subtitle2">
                {`Networth: $${formatAmount(currentNetworth)}`}
            </Typography>
          </> 
        ) : (
          <h4>No data available</h4>
        )}
      </Paper>
    </Box>
  );
};

export default NetWorthChart;
