import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { Pie } from 'react-chartjs-2';
import { Bar } from 'react-chartjs-2'
import { Chart as ChartJS } from 'chart.js/auto';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import useData from '../hooks/useData.hook';

const backgroundColor = [
  'rgba(255, 0, 0, 0.2)',
  'rgba(0, 255, 0, 0.2)',
  'rgba(0, 0, 255, 0.2)',
  'rgba(255, 255, 0, 0.2)',
  'rgba(255, 0, 255, 0.2)',
  'rgba(54, 162, 235, 0.2)',
  'rgba(128, 0, 128, 0.2)',
  'rgba(255, 165, 0, 0.2)',
  'rgba(0, 128, 0, 0.2)',
  'rgba(128, 128, 128, 0.2)',
]

const borderColor = [
  'rgba(255, 0, 0, 1)',
  'rgba(0, 255, 0, 1)',      
  'rgba(0, 0, 255, 1)',
  'rgba(255, 255, 0, 1)',
  'rgba(255, 0, 255, 1)',
  'rgba(54, 162, 235, 1)',
  'rgba(128, 0, 128, 1)',
  'rgba(255, 165, 0, 1)',
  'rgba(0, 128, 0, 1)',
  'rgba(128, 128, 128, 1)',
]

const ExpensesCharts = () => {
  const [year, setYear] = useState('');
  const [month, setMonth] = useState('');
  const { expensesData, setExpensesTableView } = useData();

  const monthList = [];

  for (let i = 1; i <= 12; i ++) {
    if (i < 10) {
      monthList.push('0' + i);
    } else {
      monthList.push(i.toString());
    }
  }

  // now since two variables then you can use useEffect to rerender when year, month changes
  const yearArr = Object.keys(expensesData.reduce((acc, curr) => {
    const { date, amount } = curr;
    
    if (!acc[date.slice(0, 4)]) {
      acc[date.slice(0, 4)] = 0;
    }

    acc[date.slice(0, 4)] += amount;

    return acc;
  }, {}));

  const data = Object.values(expensesData.reduce((acc, curr) => {
    const { category, amount } = curr;
    
    if (!acc[category]) {
      acc[category] = 0;
    }

    acc[category] += amount;

    return acc;
  }, {}));

  const keys = Object.keys(expensesData.reduce((acc, curr) => {
    const { category, amount } = curr;
    
    if (!acc[category]) {
      acc[category] = 0;
    }

    acc[category] += amount;

    return acc;
  }, {}));

  const [pieData, setPieData] = useState({
    labels: keys,
    datasets: [
      {
        label: 'total spent $',
        data: data,
        backgroundColor: backgroundColor.map((color) => color),
        borderColor: borderColor.map((color) => color),
        borderWidth: 1,
      },
    ],
  });

  return (
    <Box sx={{ width: '100%', py: 1.5 }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
          <InputLabel id="demo-simple-select-standard-label">Year</InputLabel>
          <Select
            labelId="demo-simple-select-standard-label"
            id="demo-simple-select-standard"
            value={year}
            onChange={(ev) => setYear(ev.target.value)}
            label="year"
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {
              yearArr.map((year) => {
                return (<MenuItem key={year} value={year}>{year}</MenuItem>);
              })
            }
          </Select>
        </FormControl>
        <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
          <InputLabel id="demo-simple-select-standard-label">Month</InputLabel>
          <Select
            labelId="demo-simple-select-standard-label"
            id="demo-simple-select-standard"
            value={month}
            onChange={(ev) => setMonth(ev.target.value)}
            label="Month"
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {
              monthList.map((month) => {
                return (<MenuItem key={month} value={month}>{month}</MenuItem>);
              })
            }
          </Select>
        </FormControl>
        <Box sx={{ width: 375, p: 1 }}>
          <Pie data={pieData} />
        </Box>
      </Paper>
    </Box>
  );
};

export default ExpensesCharts;
