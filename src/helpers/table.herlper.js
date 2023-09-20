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

export function getLabels(arr) {
   return Object.keys(arr.reduce((acc, curr) => {
    const { category, amount } = curr;
  
    if (!acc[category]) {
      acc[category] = 0;
    }

    acc[category] += amount;

    return acc;
  }, {}))
}

export function getData(arr) {
  return Object.values(arr.reduce((acc, curr) => {
    const { category, amount } = curr;
  
    if (!acc[category]) {
      acc[category] = 0;
    }

    acc[category] += amount;

    return acc;
  }, {}))
}