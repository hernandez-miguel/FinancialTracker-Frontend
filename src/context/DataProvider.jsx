import { createContext, useState } from "react";

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [expensesData, setExpensesData] = useState([]);
  const [balancesData, setBalancesData] = useState([]);
  const [selectedExpenses, setSelectedExpenses] = useState([]);

  return (
    <DataContext.Provider value={{ 
      expensesData, 
      setExpensesData, 
      balancesData, 
      setBalancesData,
      selectedExpenses, 
      setSelectedExpenses
    }}>
      {children}
    </DataContext.Provider>
  );
}

export default DataContext;