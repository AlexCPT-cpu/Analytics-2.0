import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { AnalyticsConsumer } from 'src/contexts/AnalyticsContext';
//import returnedData from '../../response.json';
import formatApiData from 'src/lib/formatApiData';
import PortfolioLayout from 'src/analytics/PortfolioLayout';
import UserTab from 'src/analytics/UserTab';
import axios from 'axios';

const Page = () => {
  const router = useRouter();

  const userId = router.query.address;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const {
    setApiData,
    setEthPrices,
    setBscPrices,
    setFulldata,
    setBscData,
    setBscFiltered,
    setGraphAnalytics,
    setAllData,
    allData,
  } = AnalyticsConsumer();

  useEffect(() => {
    const setData = async () => {
      try {
        setLoading(true);
        const { data: returnedData } = await axios.post('/api/analysis', {
          address: userId,
        });

        setEthPrices(returnedData.ethData.ethPrices);
        setBscPrices(returnedData.bscData.bnbData);

        const dataX = formatApiData(
          returnedData?.ethData.ethData,
          returnedData?.bscData.bscData,
          returnedData.ethData.ethPrices,
          returnedData.bscData.bnbData
        );

        setApiData(dataX.ethData);
        setBscFiltered(dataX.bscData);
        setFulldata(returnedData.ethData);
        setBscData(returnedData.bscData);
        setLoading(false);
        setAllData(returnedData);
      } catch (error) {
        console.log(error);
        setError(true);
      }
    };
    if (userId && typeof window !== 'undefined') {
      setData();
    }
  }, [
    setApiData,
    setEthPrices,
    setFulldata,
    userId,
    setAllData,
    setBscData,
    setBscFiltered,
    setBscPrices,
  ]);

  // useEffect(() => {
  //   const getReserve = async () => {
  //     const eth = await Promise.all(
  //       allData?.ethData.ethData.map((address) => ({
  //         address: address.token_address,
  //         decimal: address.decimals,
  //         pair: {
  //           ...address.reserves[1],
  //           pair: address.pair.pair,
  //           exchange: address.pair.exchange,
  //         },
  //         maxReserve: address.reserves[0].maxReserve,
  //       }))
  //     );

  //     const bsc = await Promise.all(
  //       allData?.bscData.bscData.map((address) => ({
  //         address: address.token_address,
  //         decimal: address.decimals,
  //         pair: {
  //           ...address.reserves[1],
  //           pair: address.pair.pair,
  //           exchange: address.pair.exchange,
  //         },
  //         maxReserve: address.reserves[0].maxReserve,
  //       }))
  //     );

  //     try {
  //       console.log('Call Started');
  //       const res = await axios.post('/api/reserve', {
  //         tokens: { ethTokens: eth, bscTokens: bsc },
  //         address: userId,
  //         tier: '1D',
  //       });

  //       console.log(res);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };
  //   if (allData) {
  //     getReserve();
  //   }
  // }, [allData, userId]);

  useEffect(() => {
    if (error) {
      router.push('/500');
    }
  }, [error, router]);

  return (
    <div className="flex min-h-screen justify-center">
      {loading ? <PortfolioLayout /> : <UserTab userId={userId} />}
    </div>
  );
};

export default Page;
