import { useEffect, useState } from "react";

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
  if (amount < 0) {
    amount *= -1;
  }
  
  // Convert the number to a string
  amount = amount.toFixed(2);
  
  // Split the string into integer and decimal parts (if any)
  let parts = amount.split('.');
  
  // Add commas to the integer part
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  
  // Join the integer and decimal parts (if any) and return
  return parts.join('.');
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

export function getYears(arr) {
  return Object.keys(arr.reduce((acc, curr) => {
    const { year, amount } = curr;
    
    if (!acc[year]) {
      acc[year] = 0;
    }

    acc[year] += amount;

    return acc;
  }, {}))
}

export function getBarChartLabels(arr) {
  const years = Object.keys(arr.reduce((acc, curr) => {
    const { year, amount } = curr;
    
    if (!acc[year]) {
      acc[year] = 0;
    }

    acc[year] += amount;

    return acc;
  }, {}))

  const earliestYear = Math.min(...years.map(Number));
  const latestYear = Math.max(...years.map(Number));

  const result = [];

  for (let i = earliestYear; i < latestYear; i++) {
    result.push(i);
  }

  for (let i = latestYear; i <= latestYear + 5; i++) {
    result.push(i);
  }

  return (result);
}

export function getBarChartData(arr) {
  return Object.values(arr.reduce((acc, curr) => {
    const { year, category, amount } = curr;

    if (!acc[year]) {
      acc[year] = { Cash: 0, Debt: 0, Investment: 0 };
    }

    acc[year][category] += amount;

    return acc;
  }, {}));
}

export function getYearlyTotal(arr) {
  return arr.reduce((acc, curr) => {
    const { year, amount } = curr;

    if (!acc[year]) {
      acc[year] = 0;
    }

    acc[year] += amount;

    return acc;
  }, {});
}

export function getCategoryTotal(arr) {
  return arr.reduce((acc, curr) => {
    const { category, amount } = curr;

    if (!acc[category]) {
      acc[category] = 0;
    }

    if (acc[category] === 'Debt') {
      acc[category] += (amount * -1)
    } else {
      acc[category] += amount;
    }


    return acc;
  }, {});
}