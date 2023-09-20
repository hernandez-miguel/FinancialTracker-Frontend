import { useEffect, useMemo, useState } from 'react';
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
import { getLabels, getData, getYears } from '../helpers/table.herlper';

const ExpensesCharts = () => {
  const [year, setYear] = useState('');
  const [month, setMonth] = useState('');
  const { expensesData } = useData();
  const { setExpensesTableView } = useData();
  const { setFilteredData } = useData();
  const { setPage } = useData();

  const monthList = [];

  for (let i = 1; i <= 12; i ++) {
    if (i < 10) {
      monthList.push('0' + i);
    } else {
      monthList.push(i.toString());
    }
  }

  const yearList = getYears(expensesData);

  const backgroundColor = [
    'rgba(255, 0, 0, 0.2)',      
    'rgba(0, 0, 255, 0.2)',      
    'rgba(0, 255, 0, 0.2)',      
    'rgba(255, 255, 0, 0.2)',    
    'rgba(255, 0, 255, 0.2)',    
    'rgba(0, 255, 255, 0.2)',    
    'rgba(128, 128, 128, 0.2)',  
    'rgba(255, 165, 0, 0.2)',    
    'rgba(0, 128, 0, 0.2)',      
    'rgba(128, 0, 128, 0.2)',    
    'rgba(0, 0, 0, 0.2)'         
  ]
  
  const borderColor = [
    'rgba(255, 0, 0, 1)',      
    'rgba(0, 0, 255, 1)',      
    'rgba(0, 255, 0, 1)',      
    'rgba(255, 255, 0, 1)',    
    'rgba(255, 0, 255, 1)',    
    'rgba(0, 255, 255, 1)',    
    'rgba(128, 128, 128, 1)',  
    'rgba(255, 165, 0, 1)',    
    'rgba(0, 128, 0, 1)',      
    'rgba(128, 0, 128, 1)',    
    'rgba(0, 0, 0, 1)'    
  ]

  const labels = getLabels(expensesData);
  const data = getData(expensesData);

  const [pieData, setPieData] = useState({
    labels: labels,
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
  
  useEffect(() => {
    if(month && !year) {
      const filterByMonth = expensesData.filter((expense) => {
        if (expense.date.slice(5, 7) === month) {
          return true;
        }
      });

      setFilteredData([...filterByMonth])
      setExpensesTableView([...filterByMonth]);
      setPage(0);

      setPieData({
        labels: getLabels(filterByMonth),
        datasets: [
          {
            label: 'total spent $',
            data: getData(filterByMonth),
            backgroundColor: backgroundColor.map((color) => color),
            borderColor: borderColor.map((color) => color),
            borderWidth: 1,
          },
        ],
      })
    } else if (year && !month) {
      const filterByYear = expensesData.filter((expense) => {
        if (expense.date.slice(0, 4) === year) {
          return true;
        }
      });

      setFilteredData([...filterByYear])
      setExpensesTableView([...filterByYear]);
      setPage(0);

      setPieData({
        labels: getLabels(filterByYear),
        datasets: [
          {
            label: 'total spent $',
            data: getData(filterByYear),
            backgroundColor: backgroundColor.map((color) => color),
            borderColor: borderColor.map((color) => color),
            borderWidth: 1,
          },
        ],
      })
    } else if (year && month) {
      const initialFilter = expensesData.filter((expense) => {
        if (expense.date.slice(0, 4) === year) {
          return true;
        }
      });
      const filterByMonthAndYear = initialFilter.filter((expense) => {
        if (expense.date.slice(5, 7) === month) {
          return true;
        }
      });

      setFilteredData([...filterByMonthAndYear])
      setExpensesTableView([...filterByMonthAndYear]);
      setPage(0);

      setPieData({
        labels: getLabels(filterByMonthAndYear),
        datasets: [
          {
            label: 'total spent $',
            data: getData(filterByMonthAndYear),
            backgroundColor: backgroundColor.map((color) => color),
            borderColor: borderColor.map((color) => color),
            borderWidth: 1,
          },
        ],
      })
    } else {
      setFilteredData([]);
      setExpensesTableView([...expensesData]);
      setPage(0);

      setPieData({
        labels: getLabels(expensesData),
        datasets: [
          {
            label: 'total spent $',
            data: getData(expensesData),
            backgroundColor: backgroundColor.map((color) => color),
            borderColor: borderColor.map((color) => color),
            borderWidth: 1,
          },
        ],
      })
    }
  }, [year, month, expensesData]);

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
              <em>Show all</em>
            </MenuItem>
            {
              yearList.map((year) => {
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
              <em>Show all</em>
            </MenuItem>
            {
              monthList.map((month) => {
                return (<MenuItem key={month} value={month}>{month}</MenuItem>);
              })
            }
          </Select>
        </FormControl>
        <Box sx={{ width: 350, p: 1 }}>
          <Pie data={pieData} />
        </Box>
      </Paper>
    </Box>
  );
};

export default ExpensesCharts;
