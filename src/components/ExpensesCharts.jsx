import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { Pie } from 'react-chartjs-2';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Select from '@mui/material/Select';
import useData from '../hooks/useData.hook';
import useMediaQuery from '@mui/material/useMediaQuery';
import { getPieLabels, getPieData, getBarData } from '../helpers/expensesPage.helper';
import { getMonthList, getYears, getTotal } from '../helpers/expensesPage.helper';
import { getBackgroundColor, getBorderColor } from '../helpers/expensesPage.helper';
import { formatAmount } from '../helpers/expensesPage.helper';

const ExpensesCharts = () => {
  const [year, setYear] = useState('');
  const [month, setMonth] = useState('');
  const [expensesTotal, setExpensesTotal] = useState(0);
  const { expensesData } = useData();
  const { expensesTableView, setExpensesTableView } = useData();
  const { setFilteredData } = useData();
  const { setPage } = useData();

  const mobileView = useMediaQuery('(max-width:600px)');
  const monthList = getMonthList();
  const yearList = getYears(expensesData);

  const backgroundColor = getBackgroundColor();
  const borderColor = getBorderColor();

  const pieChartLabels = getPieLabels(expensesData);
  const pieChartData = getPieData(expensesData);

  const barChartData = getBarData(expensesData);

  const [pieData, setPieData] = useState({
    labels: pieChartLabels,
    datasets: [
      {
        data: pieChartData,
        backgroundColor: backgroundColor.map((color) => color),
        borderColor: borderColor.map((color) => color),
        borderWidth: 1,
      },
    ],
  });

  const pieChartOptions = {
    responsive: true,
    aspectRatio: mobileView ? 1.25 : 3.25,
    plugins: {
      title: {
        display: true,
        text: 'Expense by Category',
        align: 'center',
      },
    },
  };

  const [barData, setBarData] = useState({
    labels: monthList.map((item) => item.month),
    datasets: [
      {
        data: barChartData,
        backgroundColor: ['rgba(255, 99, 132, 0.2)'],
        borderColor: ['rgba(255, 99, 132, 1)'],
        borderWidth: 1,
      },
    ],
  });

  const barChartOptions = {
    responsive: true,
    aspectRatio: mobileView ? 1 : 2.50,
    plugins: {
      title: {
        display: true,
        text: 'Monthly Total',
        align: 'center',
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
          drawBorder: false,
        }
      },
      y: {
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
    if (month && !year) {
      const filterByMonth = expensesData.filter((expense) => {
        if (expense.date.slice(5, 7) === month) {
          return true;
        }
      });

      setExpensesTotal(getTotal(filterByMonth));
      setFilteredData([...filterByMonth]);
      setExpensesTableView([...filterByMonth]);
      setPage(0);

      setPieData({
        labels: getPieLabels(filterByMonth),
        datasets: [
          {
            label: 'total spent $',
            data: getPieData(filterByMonth),
            backgroundColor: backgroundColor.map((color) => color),
            borderColor: borderColor.map((color) => color),
            borderWidth: 1,
          },
        ],
      });

      setBarData({
        labels: monthList.map((item) => item.month),
        datasets: [
          {
            label: 'total spent $',
            data: getBarData(filterByMonth),
            backgroundColor: ['rgba(255, 99, 132, 0.2)'],
            borderColor: ['rgba(255, 99, 132, 1)'],
            borderWidth: 1,
          },
        ],
      });
    } else if (year && !month) {
      const filterByYear = expensesData.filter((expense) => {
        if (expense.date.slice(0, 4) === year) {
          return true;
        }
      });

      setFilteredData([...filterByYear]);
      setExpensesTableView([...filterByYear]);
      setExpensesTotal(getTotal(filterByYear));
      setPage(0);

      setPieData({
        labels: getPieLabels(filterByYear),
        datasets: [
          {
            label: 'total spent $',
            data: getPieData(filterByYear),
            backgroundColor: backgroundColor.map((color) => color),
            borderColor: borderColor.map((color) => color),
            borderWidth: 1,
          },
        ],
      });

      setBarData({
        labels: monthList.map((item) => item.month),
        datasets: [
          {
            label: 'total spent $',
            data: getBarData(filterByYear),
            backgroundColor: ['rgba(255, 99, 132, 0.2)'],
            borderColor: ['rgba(255, 99, 132, 1)'],
            borderWidth: 1,
          },
        ],
      });
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

      setFilteredData([...filterByMonthAndYear]);
      setExpensesTableView([...filterByMonthAndYear]);
      setExpensesTotal(getTotal(filterByMonthAndYear));
      setPage(0);

      setPieData({
        labels: getPieLabels(filterByMonthAndYear),
        datasets: [
          {
            label: 'total spent $',
            data: getPieData(filterByMonthAndYear),
            backgroundColor: backgroundColor.map((color) => color),
            borderColor: borderColor.map((color) => color),
            borderWidth: 1,
          },
        ],
      });

      setBarData({
        labels: monthList.map((item) => item.month),
        datasets: [
          {
            label: 'total spent $',
            data: getBarData(filterByMonthAndYear),
            backgroundColor: ['rgba(255, 99, 132, 0.2)'],
            borderColor: ['rgba(255, 99, 132, 1)'],
            borderWidth: 1,
          },
        ],
      });
    } else {
      setFilteredData([]);
      setExpensesTableView([...expensesData]);
      setExpensesTotal(getTotal(expensesData));
      setPage(0);

      setPieData({
        labels: getPieLabels(expensesData),
        datasets: [
          {
            label: 'total spent $',
            data: getPieData(expensesData),
            backgroundColor: backgroundColor.map((color) => color),
            borderColor: borderColor.map((color) => color),
            borderWidth: 1,
          },
        ],
      });

      setBarData({
        labels: monthList.map((item) => item.month),
        datasets: [
          {
            label: 'total spent $',
            data: getBarData(expensesData),
            backgroundColor: ['rgba(255, 99, 132, 0.2)'],
            borderColor: ['rgba(255, 99, 132, 1)'],
            borderWidth: 1,
          },
        ],
      });
    }
  }, [year, month, expensesData]);

  return (
    <Box sx={{ width: '100%', paddingTop: 2 }}>
      <Paper sx={{ width: '100%', mb: 2, p: 1.5 }}>
        <Stack direction={'row'} justifyContent={ mobileView ? 'center' : 'start'}>
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
              {yearList.map((year) => {
                return (
                  <MenuItem key={year} value={year}>
                    {year}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
          <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
            <InputLabel id="month-selector-label">Month</InputLabel>
            <Select
              labelId="month-selector-label"
              id="month-selector"
              value={month}
              onChange={(ev) => setMonth(ev.target.value)}
              label="Month"
            >
              <MenuItem value="">
                <em>Show all</em>
              </MenuItem>
              {monthList.map((item) => {
                return (
                  <MenuItem key={item.key} value={item.key}>
                    {item.month}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </Stack>
        <Stack direction={'column'} spacing={2} textAlign={'center'}>
          {expensesTableView.length > 0 ? (
            <>
              <Pie data={pieData} options={pieChartOptions} />
              <Bar data={barData} options={barChartOptions} />
              <Typography marginTop={'25px'} variant="subtitle2">
                {`Total Expenses: $${formatAmount(expensesTotal)}`}
              </Typography>
            </>
          ) : (
            <h4>No data available</h4>
          )}
        </Stack>
      </Paper>
    </Box>
  );
};

export default ExpensesCharts;
