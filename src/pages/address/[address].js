import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { AnalyticsConsumer } from 'src/contexts/AnalyticsContext';
//import returnedData from '../../response.json';
import formatApiData from 'src/lib/formatApiData';
import PortfolioLayout from 'src/analytics/PortfolioLayout';
import UserTab from 'src/analytics/UserTab';
import axios from 'axios';
import noNulls from 'src/lib/noNulls';

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

        setEthPrices(returnedData?.ethData?.ethPrices);
        setBscPrices(returnedData?.bscData?.bnbData);

        const dataX = formatApiData(
          returnedData?.ethData?.ethData,
          returnedData?.bscData?.bscData,
          returnedData?.ethData?.ethPrices,
          returnedData?.bscData?.bnbData
        );
        const ethDataX = await noNulls(dataX?.ethData);
        const bscDataX = await noNulls(dataX?.bscData);
        setApiData(ethDataX);
        setBscFiltered(bscDataX);
        setFulldata(returnedData?.ethData);
        setBscData(returnedData?.bscData);
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

  //   useEffect(() => {
  //     const getReserve = async () => {
  //       const eth = await Promise.all(
  //         allData?.ethData.ethData.map((address) => {
  //           if (address.reserves['0']) {
  //             return {
  //               address: address.token_address,
  //               decimals: address.decimals,
  //               maxReserve: address.reserves['0'].maxReserve,
  //               exchange: address.reserves.exchange,
  //               fee: address.reserves['0'].nowReserve.fee ? address.reserves['0'].nowReserve.fee : 0,
  //             };
  //           }
  //         })
  //       );
  //       const bsc = await Promise.all(
  //         allData?.bscData.bscData.map((address) => {
  //           if (address.reserves['0']) {
  //             return {
  //               address: address.token_address,
  //               decimals: address.decimals,
  //               maxReserve: address.reserves['0'].maxReserve,
  //               exchange: address.reserves.exchange,
  //               fee: address.reserves['0'].nowReserve.fee ? address.reserves['0'].nowReserve.fee : 0,
  //             };
  //           }
  //         })
  //       );
  //       try {
  //         console.log('Call Started');
  //         const ethParsed = await noNulls(eth);
  //         const bscParsed = await noNulls(bsc);

  //         const res = await axios.post('/api/reserve', {
  //           tokens: { ethTokens: ethParsed, bscTokens: bscParsed },
  //           address: '0xefd01453be7b725AB3fc57D5D280FDc46609F253',
  //           tier: '1H',
  //         });
  // setGraphAnalytics(res.data)
  //       } catch (error) {
  //         console.log(error);
  //       }
  //     };
  //     if (allData) {
  //       getReserve();
  //     }
  //   }, [allData, userId, setGraphAnalytics]);

  useEffect(() => {
    if (error) {
      router.push('/error');
    }
  }, [error, router]);

  return (
    <div className="flex min-h-screen justify-center">
      {loading ? <PortfolioLayout /> : <UserTab userId={userId} />}
    </div>
  );
};

export default Page;
