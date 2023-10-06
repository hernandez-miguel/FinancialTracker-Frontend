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

export const categoryList = [
  'Dining out',
  'Entertainment',
  'Groceries',
  'Insurance',
  'Materials/Supplies',
  'Mortgage/Rent',
  'Shopping',
  'Taxes',
  'Transportation',
  'Utility',
  'Other',
];

export function getMonthList() {
  const months = [
    'January', 'February', 'March', 'April',
    'May', 'June', 'July', 'August',
    'September', 'October', 'November', 'December'
  ];

  const monthsArr = months.map((month, index) => ({
    key: (index + 1).toString().padStart(2, '0'),
    month: month
  }));

  return monthsArr;
}

export function getBackgroundColor() {
  const arr = [
    'rgba(255, 99, 132, 0.2)',
    'rgba(255, 159, 64, 0.2)',
    'rgba(255, 205, 86, 0.2)',
    'rgba(75, 192, 192, 0.2)',
    'rgba(54, 162, 235, 0.2)',
    'rgba(153, 102, 255, 0.2)',
    'rgba(255, 192, 203, 0.2)',
    'rgba(128, 0, 0, 0.2)',
    'rgba(255,228,196, 0.2)',
    'rgba(201, 203, 207, 0.2)',
    'rgba(0, 0, 0, 0.2)' 
  ]

  return arr;
}

export function getBorderColor() {
  const arr = [
    'rgba(255, 99, 132, 1)',
    'rgba(255, 159, 64, 1)',
    'rgba(255, 205, 86, 1)',
    'rgba(75, 192, 192, 1)',
    'rgba(54, 162, 235, 1)',
    'rgba(153, 102, 255, 1)',
    'rgba(255, 192, 203, 1)',
    'rgba(128, 0, 0, 1)',
    'rgba(255,228,196, 1)',
    'rgba(201, 203, 207, 1)',
    'rgba(0, 0, 0, 1)' 
  ]

  return arr;
}

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

export function capitalizeWords(str) {
  if (str.includes('/')) {
    return str.replace(/\b\w/g, (match) => match.toUpperCase());
  } else {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}

export function getYears(arr) {
  return Object.keys(arr.reduce((acc, curr) => {
    const { date, amount } = curr;
    
    if (!acc[date.slice(0, 4)]) {
      acc[date.slice(0, 4)] = 0;
    }

    acc[date.slice(0, 4)] += amount;

    return acc;
  }, {}))
}

export function getPieLabels(arr) {
   return Object.keys(arr.reduce((acc, curr) => {
    const { category, amount } = curr;
  
    if (!acc[category]) {
      acc[category] = 0;
    }

    acc[category] += amount;

    return acc;
  }, {}))
}

export function getPieData(arr) {
  return Object.values(arr.reduce((acc, curr) => {
    const { category, amount } = curr;
  
    if (!acc[category]) {
      acc[category] = 0;
    }

    acc[category] += amount;

    return acc;
  }, {}))
}

export function getBarData(arr) {
  const obj = arr.reduce((acc, curr) => {
    const { date, amount } = curr;
    
    if (!acc[date.slice(5, 7)]) {
      acc[date.slice(5, 7)] = 0;
    }

    acc[date.slice(5, 7)] += amount;

    return acc;
  }, {});

  const resultArr = Array.from({ length: 12 }, (_, index) => {
    const key = (index + 1).toString().padStart(2, '0');
    return obj.hasOwnProperty(key) ? obj[key] : 0;
  });

  return resultArr;
}

export function getTotal(arr) {
  const total = arr.reduce((acc, curr) => {
    return (acc * 100 + curr.amount * 100) / 100;
  }, 0)

  return total;
}