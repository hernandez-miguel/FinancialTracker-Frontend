import { createContext, useState } from "react";

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [expensesData, setExpensesData] = useState([]);
  const [netWorthData, setNetWorthData] = useState([]);
  const [expensesTableView, setExpensesTableView] = useState([]);
  const [netWorthTableView, setNetWorthTableView] = useState([]);
  const [selectedExpenses, setSelectedExpenses] = useState([]);
  const [selectedBalances, setSelectedBalances] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [page, setPage] = useState(0);

  return (
    <DataContext.Provider value={{ 
      expensesData, 
      setExpensesData, 
      netWorthData, 
      setNetWorthData,
      selectedExpenses, 
      setSelectedExpenses,
      selectedBalances,
      setSelectedBalances,
      expensesTableView,
      setExpensesTableView,
      netWorthTableView,
      setNetWorthTableView,
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