import { useState } from "react";
import { useContext, createContext } from "react";

const AnalyticsContext = createContext(null);

export const AnalyticsContextProvider = ({ children }) => {
  const [apiData, setApiData] = useState([]);
  const [ethPrices, setEthPrices] = useState([]);
  const [bscPrices, setBscPrices] = useState([]);
  const [fullData, setFulldata] = useState({});
  const [bscData, setBscData] = useState({});
  const [history, setHistory] = useState([]);
  const [bscFiltered, setBscFiltered] = useState([]);
  const [allData, setAllData] = useState(null);
  const [graphAnalytics, setGraphAnalytics] = useState(null);
  return (
    <AnalyticsContext.Provider
      value={{
        apiData,
        setApiData,
        ethPrices,
        setEthPrices,
        fullData,
        setFulldata,
        history,
        setHistory,
        bscData,
        setBscData,
        bscFiltered,
        setBscFiltered,
        bscPrices,
        setBscPrices,
        allData,
        setAllData,
        graphAnalytics,
        setGraphAnalytics,
      }}
    >
      {children}
    </AnalyticsContext.Provider>
  );
};

export const AnalyticsConsumer = () => {
  return useContext(AnalyticsContext);
};

export default AnalyticsContextProvider;
