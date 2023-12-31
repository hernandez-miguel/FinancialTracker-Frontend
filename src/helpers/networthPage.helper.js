import { useEffect, useState } from "react";

export const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};

export function useDebounceValue(value, time) {
  const [debounceValue, setDebounceValue] = useState(value);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebounceValue(value);
    }, time)

    return () => {
      clearTimeout(timeout)
    }
  }, [value, time]);

  return debounceValue;
}

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

export function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

export function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

export function formatAmount(amount) {
  // Convert the number to a string
  amount = amount.toFixed(2);
  
  // Split the string into integer and decimal parts (if any)
  let parts = amount.split('.');
  
  // Add commas to the integer part
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  
  // Join the integer and decimal parts (if any) and return
  return parts.join('.');
}

export function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function updateBalance(firstNum, secondNum, type) {
  if (type === 'update') {
    const total = (firstNum * 100 + secondNum * 100) / 100;
    return Math.round(100 * total) / 100;
  } else if (type === 'delete') {
    const total = (firstNum * 100 - secondNum * 100) / 100;
    return Math.round(100  * total) / 100;
  }
}

export function formatChanges(chg) {
  // Convert the input to a number
  const number = parseFloat(chg);

  // Check if the input is a valid number
  if (isNaN(number)) {
    return 'Invalid input';
  }

  // Use toLocaleString to format the number with commas and two decimal places
  const formattedNumber = (number >= 0 ? '+' : '') +
    number.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  return formattedNumber;
}

export function getNetChg(prevAmount, updatedAmount) {
  if (prevAmount === updatedAmount) {
    return '';
  }

  const netChange = (updatedAmount * 100 - prevAmount * 100) / 100;
  
  return Math.round(100 * netChange) / 100;
}

export function getPercentChg(prevAmount, updatedAmount) {
  if (prevAmount === updatedAmount) {
    return '';
  }

  const netChange = (updatedAmount * 100 - prevAmount * 100) / 100;
  const percentChg = (netChange / prevAmount);

  return Math.round(10000 * percentChg) / 10000;
}

export function sortByYear(arr) {
  return arr.sort((a, b) => a.year - b.year);
}

export function getDeletedData(arr) {
  const result = [];

  arr.forEach((item) => {
    const year = parseInt(item.updatedAt.slice(0, 4));

    if (!result.find((entry) => entry.year === year)) {
      result.push({ year, cash: 0, debt: 0, investment: 0 });
    }

    if (item.category === 'cash') {
      result.find((entry) => entry.year === year).cash += item.balance;
    } else if (item.category === 'investment') {
      result.find((entry) => entry.year === year).investment += item.balance;
    } else if (item.category === 'debt') {
      result.find((entry) => entry.year === year).debt += item.balance * -1;
    }
  });

  return result.sort((a, b) => a.year - b.year);
}

export function removeItemsByIndices(arr, indices) {
  // Sort indices in descending order to avoid index shifting issues
  indices.sort((a, b) => b - a);

  // Remove elements from the array based on the sorted indices
  for (let i = 0; i < indices.length; i++) {
    const index = indices[i];
    if (index >= 0 && index < arr.length) {
      arr.splice(index, 1);
    }
  }

  return arr;
}

export function getBarChartLabels(arr) {
  if (arr.length < 1) {
    return [];
  }

  const earliestYear = Math.min(...arr.map((item) => item.year));
  const latestYear = Math.max(...arr.map((item) => item.year));
  const result = [];

  for (let i = earliestYear; i < latestYear; i++) {
    result.push(i);
  }

  for (let i = latestYear; i <= latestYear + 5; i++) {
    result.push(i);
  }

  return (result);
}

export function getYearlyNetworth(arr) {
  const sortedData = sortByYear(arr);

  const reducedData = sortedData.reduce((acc, curr) => {
    const { year, cash, debt, investment } = curr;

    if(!acc[year]) {
      acc[year] = 0;
    } 

    acc[year] += cash;
    acc[year] += debt;
    acc[year] += investment;

    acc[year] = (Math.round(acc[year] * 100) / 100);

    return acc;
  }, {});

  const reducedDataVlues = Object.values(reducedData);

  return reducedDataVlues;
}

export function getCurrentNetworth(arr) {
  if(arr.length === 0) {
    return 0;
  }
  const sortedData = sortByYear(arr);

  const reducedData = sortedData.reduce((acc, curr) => {
    const { year, cash, debt, investment } = curr;

    if(!acc[year]) {
      acc[year] = 0;
    }

    acc[year] += cash;
    acc[year] += debt;
    acc[year] += investment;

    acc[year] = (Math.round(acc[year] * 100) / 100);

    return acc;
  }, {});

  const reducedDataVlues =  Object.values(reducedData);
  const lastItem = reducedDataVlues.length - 1;

  return reducedDataVlues[lastItem];
}