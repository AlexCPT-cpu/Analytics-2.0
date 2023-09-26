import React, { useCallback, useEffect, useMemo, useState } from 'react';
import SearchBar from './SearchBar';
import { CryptoCard } from './CryptoCard';
import { MobileCryptoCard } from './MobileCryptoCard';
import { GroupedList } from './GroupedList';
import { AssetsTable } from './AssetsTable';
import { useTheme } from '@mui/material/styles';
import { AnalyticsConsumer } from 'src/contexts/AnalyticsContext';
//import tier from 'src/tier.json';
import formatTier from 'src/libs/formatTier';
import axios from 'axios';

const UserTab = ({ userId }) => {
  const theme = useTheme();
  const [buttons, setbuttons] = useState([
    {
      variant: 'contained',
      text: '1H',
    },
    {
      variant: 'outlined',
      text: '1D',
    },
    {
      variant: 'outlined',
      text: '1W',
    },
    {
      variant: 'outlined',
      text: '1M',
    },
  ]);
  const [loading, setLoading] = useState(true);
  const [duratia, setDuratia] = useState('1H');
  const [chartArr, setChartArr] = useState([]);

  const {
    apiData,
    ethPrices,
    fullData,
    history,
    setHistory,
    bscFiltered,
    bscPrices,
    bscData,
    allData,
  } = AnalyticsConsumer();

  const eth = useMemo(
    () =>
      allData?.ethData.ethData.map((address) => ({
        address: address.token_address,
        decimal: address.decimals,
        pair: {
          ...address.reserves[1],
          pair: address.pair.pair,
          exchange: address.pair.exchange,
        },
        maxReserve: address.reserves[0].maxReserve,
      })),
    [allData]
  );

  const bsc = useMemo(
    () =>
      allData?.bscData.bscData.map((address) => ({
        address: address.token_address,
        decimal: address.decimals,
        pair: {
          ...address.reserves[1],
          pair: address.pair.pair,
          exchange: address.pair.exchange,
        },
        maxReserve: address.reserves[0].maxReserve,
      })),
    [allData]
  );

  useEffect(() => {
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    const setTransactions = async () => {
      //console.time("apiCall");
      // const { data } = await axios.post(endpoint + "transactions", {
      //   address: userId,
      // });
      // console.timeEnd("apiCall");
      const txs = [];

      await Promise.all(
        allData.transactions.data.transactions?.map(async (transaction) => {
          const date2 = new Date(transaction.timestamp);
          const day = date2.getDate();
          const month = date2.getMonth();
          const date = `${months[month]}, ${day}`;

          txs.push({
            ...transaction,
            date: date,
            jsDate: date2,
          });
        })
      );

      const sorted = txs.sort((a, b) => b.jsDate - a.jsDate);
      setHistory(sorted);
    };
    setTransactions();
  }, [userId, setHistory, allData.transactions.data.transactions]);

  const slicedHistory = useMemo(() => history.slice(0, 7), [history]);

  function calculateProfitLoss(recentValue, oneDayAgoValue) {
    let priceDifference = 0;
    let percentageChange = 0;

    let zero = 1;
    if (oneDayAgoValue > 0) {
      priceDifference = recentValue - oneDayAgoValue;
    } else {
      priceDifference = recentValue - zero;
    }
    const profitLoss = priceDifference > 0 ? 'Profit' : 'Loss';
    if (oneDayAgoValue > 0) {
      percentageChange = (priceDifference / oneDayAgoValue) * 100;
    } else {
      percentageChange = (priceDifference / zero) * 100;
    }

    return {
      profitLoss,
      priceDifference: priceDifference,
      percentageChange,
    };
  }

  const nowPrices = apiData.reduce((accumulator, item) => {
    return accumulator + item?.nowPriceBal;
  }, 0);
  const hourPrices = apiData.reduce((accumulator, item) => accumulator + item?.hourPriceBal, 0);
  // const dayPrices = apiData.reduce((accumulator, item) => accumulator + item?.dayPriceBal, 0);
  // const weekPrices = apiData.reduce((accumulator, item) => accumulator + item?.weekPriceBal, 0);
  // const monthPrices = apiData.reduce((accumulator, item) => accumulator + item?.monthPriceBal, 0);

  const bscNowPrices = bscFiltered.reduce(
    (accumulator, item) => accumulator + item?.nowPriceBal,
    0
  );
  const bscHourPrices = bscFiltered.reduce(
    (accumulator, item) => accumulator + item?.hourPriceBal,
    0
  );
  // const bscDayPrices = bscFiltered.reduce(
  //   (accumulator, item) => accumulator + item?.dayPriceBal,
  //   0
  // );
  // const bscWeekPrices = bscFiltered.reduce(
  //   (accumulator, item) => accumulator + item?.weekPriceBal,
  //   0
  // );
  // const bscMonthPrices = bscFiltered.reduce(
  //   (accumulator, item) => accumulator + item?.monthPriceBal,
  //   0
  // );
  const [ethDuration, setEthDuration] = useState(
    (hourPrices + fullData.ethBalances.balances.balances[0]) * ethPrices.eth_Price1H
  );

  const [ethNowBalance, setEthNowBalance] = useState(
    (nowPrices + fullData.ethBalances.balanceNow) * ethPrices.eth_PriceNow
  );
  const [bscDuration, setBscDuration] = useState(
    (bscHourPrices + bscData.bscBalances.balances.balances[0]) * bscPrices.bnb_Price1H
  );
  const [bscNowBalance, setBscNowBalance] = useState(
    (bscNowPrices + bscData.bscBalances.balanceNow) * bscPrices.bnb_PriceNow
  );
  const [nowBalance, setNowBalance] = useState(ethNowBalance + bscNowBalance);

  const ethCalculations = calculateProfitLoss(
    ethNowBalance + bscNowBalance,
    ethDuration + bscDuration
  );

  const calculations = {
    profitLoss: ethCalculations.profitLoss,
    priceDiffrence: ethCalculations.priceDifference,
    percentageChange: ethCalculations.percentageChange,
  };

  const select = useCallback(
    async (selector) => {
      if (selector.text === '1H') {
        try {
          const { data } = await axios.post('/api/reserve', {
            tokens: { ethTokens: eth, bscTokens: bsc },
            address: userId,
            tier: '1H',
          });
          setbuttons([
            {
              variant: 'contained',
              text: '1H',
            },
            {
              variant: 'outlined',
              text: '1D',
            },
            {
              variant: 'outlined',
              text: '1W',
            },
            {
              variant: 'outlined',
              text: '1M',
            },
          ]);
          setDuratia('1H');
          const { tier0, ethValue, bscValue } = formatTier(data, allData, bscData);
          setEthDuration(ethValue);
          setBscDuration(bscValue);
          setChartArr(tier0);
        } catch (error) {
          console.log(error);
        } finally {
          setLoading(false);
        }
      } else if (selector.text === '1D') {
        try {
          setLoading(true);
          const { data } = await axios.post('/api/reserve', {
            tokens: { ethTokens: eth, bscTokens: bsc },
            address: userId,
            tier: '1D',
          });
          setbuttons([
            {
              variant: 'outlined',
              text: '1H',
            },
            {
              variant: 'contained',
              text: '1D',
            },
            {
              variant: 'outlined',
              text: '1W',
            },
            {
              variant: 'outlined',
              text: '1M',
            },
          ]);
          setDuratia('1D');
          const { tier0, ethValue, bscValue } = formatTier(data, allData, bscData);
          setEthDuration(ethValue);
          setBscDuration(bscValue);
          setChartArr(tier0);
        } catch (error) {
          console.log(error);
        } finally {
          setLoading(false);
        }
      } else if (selector.text === '1W') {
        try {
          setLoading(true);
          const { data } = await axios.post('/api/reserve', {
            tokens: { ethTokens: eth, bscTokens: bsc },
            address: userId,
            tier: '1W',
          });
          console.log(data);
          setbuttons([
            {
              variant: 'outlined',
              text: '1H',
            },
            {
              variant: 'outlined',
              text: '1D',
            },
            {
              variant: 'contained',
              text: '1W',
            },
            {
              variant: 'outlined',
              text: '1M',
            },
          ]);
          setDuratia('1W');
          const { tier0, ethValue, bscValue } = formatTier(data, allData, bscData);
          setEthDuration(ethValue);
          setBscDuration(bscValue);
          setChartArr(tier0);
        } catch (error) {
          console.log(error);
        } finally {
          setLoading(false);
        }
      } else if (selector.text === '1M') {
        try {
          setLoading(true);
          const { data } = await axios.post('/api/reserve', {
            tokens: { ethTokens: eth, bscTokens: bsc },
            address: userId,
            tier: '1M',
          });

          setbuttons([
            {
              variant: 'outlined',
              text: '1H',
            },
            {
              variant: 'outlined',
              text: '1D',
            },
            {
              variant: 'outlined',
              text: '1W',
            },
            {
              variant: 'contained',
              text: '1M',
            },
          ]);
          setDuratia('1M');
          const { tier0, ethValue, bscValue } = formatTier(data, allData, bscData);
          setEthDuration(ethValue);
          setBscDuration(bscValue);
          setChartArr(tier0);
        } catch (error) {
          console.log(error);
        } finally {
          setLoading(false);
        }
      } else {
        try {
          setLoading(true);
          const { data } = await axios.post('/api/reserve', {
            tokens: { ethTokens: eth, bscTokens: bsc },
            address: userId,
            tier: '1H',
          });
          setbuttons([
            {
              variant: 'contained',
              text: '1H',
            },
            {
              variant: 'outlined',
              text: '1D',
            },
            {
              variant: 'outlined',
              text: '1W',
            },
            {
              variant: 'outlined',
              text: '1M',
            },
          ]);
          setDuratia('1H');
          const { tier0, ethValue, bscValue } = formatTier(data, allData, bscData);
          setEthDuration(ethValue);
          setBscDuration(bscValue);
          setChartArr(tier0);
        } catch (error) {
          console.log(error);
        } finally {
          setLoading(false);
        }
      }
    },
    [allData, bscData, userId, eth, bsc]
  );

  useEffect(() => {
    const getReserve = async () => {
      try {
        setLoading(true);
        const { data } = await axios.post('/api/reserve', {
          tokens: { ethTokens: eth, bscTokens: bsc },
          address: userId,
          tier: '1H',
        });

        setbuttons([
          {
            variant: 'contained',
            text: '1H',
          },
          {
            variant: 'outlined',
            text: '1D',
          },
          {
            variant: 'outlined',
            text: '1W',
          },
          {
            variant: 'outlined',
            text: '1M',
          },
        ]);
        setDuratia('1H');

        if (data.bscData && data.ethData) {
          const { tier0, ethValue, bscValue } = formatTier(data, allData, bscData);

          setEthDuration(ethValue);
          setBscDuration(bscValue);
          setChartArr(tier0);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    if (allData) {
      getReserve();
    }
  }, [allData, bscData, userId, bsc, eth]);

  return (
    <div className="flex flex-col justify-center items-center pt-5 mx-auto overflow-hidden w-full">
      <div>
        <SearchBar />
      </div>

      <div className="flex flex-col w-full mx-auto lg:flex-row items-center justify-center mt-5 lg:mt-15 space-y-8 space-x-0 lg:space-y-0 lg:space-x-4 mb-10 overflow-hidden">
        <div className="flex justify-center items-center">
          <div className="hidden lg:flex overflow-hidden items-center justify-center">
            <CryptoCard
              chartArr={chartArr}
              chartColor={theme.palette.primary.main}
              coinAmount={
                isFinite(Number(calculations?.priceDiffrence.toFixed(3)))
                  ? Number(calculations?.priceDiffrence).toFixed(3)
                  : 0
              }
              currency="USD"
              rate={
                isFinite(Number(calculations.percentageChange).toFixed(5))
                  ? calculations.percentageChange.toLocaleString(5)
                  : 0
              }
              sx={{ height: '650px', width: '700px' }}
              usdValue={isFinite(Number(nowBalance)) ? Number(nowBalance) : 0}
              buttons={buttons}
              duratia={duratia}
              select={select}
              loading={loading}
            />
          </div>
        </div>
        <div className="flex lg:hidden overflow-hidden items-center justify-center mx-auto">
          <MobileCryptoCard
            chartArr={chartArr}
            chartColor={theme.palette.primary.main}
            coinAmount={
              isFinite(Number(calculations?.priceDiffrence.toFixed(3)))
                ? Number(calculations?.priceDiffrence).toFixed(3)
                : 0
            }
            currency="USD"
            rate={
              isFinite(Number(calculations.percentageChange).toFixed(5))
                ? calculations.percentageChange.toLocaleString(5)
                : 0
            }
            usdValue={isFinite(Number(nowBalance)) ? Number(nowBalance) : 0}
            buttons={buttons}
            duratia={duratia}
            select={select}
            loading={loading}
          />
        </div>
        <div className="hidden lg:flex justify-center items-center">
          <GroupedList
            userId={userId}
            slicedHistory={slicedHistory}
          />
        </div>
        <div className="lg:hidden flex justify-center items-center w-[98vw]">
          <GroupedList
            userId={userId}
            slicedHistory={slicedHistory}
          />
        </div>
      </div>
      <div className="w-full px-0 lg:px-20 mt-5 mb-20 flex justify-center items-center overflow-hidden">
        <AssetsTable />
      </div>
    </div>
  );
};

export default UserTab;
