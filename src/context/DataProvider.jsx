import { createContext, useState } from "react";

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [expensesData, setExpensesData] = useState([]);
  const [accountsData, setAccountsData] = useState([]);
  const [balancesData, setBalancesData] = useState([]);
  const [expensesTableView, setExpensesTableView] = useState([]);
  const [accountsTableView, setAccountsTableView] = useState([]);
  const [selectedExpenses, setSelectedExpenses] = useState([]);
  const [selectedAccounts, setSelectedAccounts] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [page, setPage] = useState(0);

  return (
    <DataContext.Provider value={{ 
      expensesData, 
      setExpensesData, 
      accountsData, 
      setAccountsData,
      balancesData,
      setBalancesData,
      selectedExpenses, 
      setSelectedExpenses,
      selectedAccounts,
      setSelectedAccounts,
      expensesTableView,
      setExpensesTableView,
      accountsTableView,
      setAccountsTableView,
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