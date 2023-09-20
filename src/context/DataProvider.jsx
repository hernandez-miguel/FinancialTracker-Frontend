import { createContext, useState } from "react";

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [expensesData, setExpensesData] = useState([]);
  const [balancesData, setBalancesData] = useState([]);
  const [expensesTableView, setExpensesTableView] = useState([]);
  const [selectedExpenses, setSelectedExpenses] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [page, setPage] = useState(0);

  return (
    <DataContext.Provider value={{ 
      expensesData, 
      setExpensesData, 
      balancesData, 
      setBalancesData,
      selectedExpenses, 
      setSelectedExpenses,
      expensesTableView,
      setExpensesTableView,
      filteredData,
      setFilteredData,
      page,
      setPage
    }}>
      {children}
    </DataContext.Provider>
  );
}

export default DataContext;