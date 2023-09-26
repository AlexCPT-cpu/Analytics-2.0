import { useEffect, useMemo } from 'react';
import Skeleton from '@mui/material/Skeleton';
import { useRouter } from 'next/router';
import { ethers } from 'ethers';
import axios from 'axios';
import {
  UniswapV2,
  UniswapV3,
  bscProviderKey,
  endpoint,
  ethProviderKey,
  oneInchV5,
} from 'src/config/index';
import oneInchV5Abi from 'src/config/oneInchV5Abi.json';
import erc20Abi from 'src/config/erc20Abi.json';
import { HistoryList } from 'src/analytics/HistoryList';
import { AnalyticsConsumer } from 'src/contexts/AnalyticsContext';
import KeyboardBackspaceRoundedIcon from '@mui/icons-material/KeyboardBackspaceRounded';

const History = () => {
  const { history, setHistory } = AnalyticsConsumer();
  const router = useRouter();

  function formatNumber(value) {
    const suffixes = ['', 'K', 'M', 'B', 'T', 'Q', 'QT', 'ST', 'SP', 'OT', 'NN', 'DC'];

    let suffixIndex = 0;
    while (value >= 1000 && suffixIndex < suffixes.length - 1) {
      value /= 1000;
      suffixIndex++;
    }

    return value.toFixed(1) + suffixes[suffixIndex];
  }

  function convertToStandardForm(number) {
    const numberString = number.toExponential(2);
    const [formattedNumber, exponent] = numberString.split('e');

    return `${formattedNumber}${exponent}`;
  }

  const ethProvider = useMemo(() => new ethers.JsonRpcProvider(ethProviderKey), []);
  const bscProvider = useMemo(() => new ethers.JsonRpcProvider(bscProviderKey), []);

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
    const setData = async (id) => {
      const { data } = await axios.post(endpoint + 'transactions', {
        address: id,
      });

      const txs = [];
      const bscTxs = [];
      await Promise.all(
        data?.eth?.map(async (transaction) => {
          if (transaction.functionName === 'transfer(address _to, uint256 _value)') {
            const contract = new ethers.Contract(transaction.to, erc20Abi, ethProvider);
            const decimals = await contract.decimals();
            const symbol = await contract.symbol();
            const decodedData = contract.interface.decodeFunctionData(
              'transfer',
              transaction.input
            );
            const amount = parseInt(decodedData[1]) / 10 ** parseInt(decimals);
            const date2 = new Date(transaction.timeStamp * 1000);
            const day = date2.getDate();
            const month = date2.getMonth();
            const date = `${months[month]}, ${day}`;
            let suffix;

            if (amount > 1e30) {
              suffix = convertToStandardForm(amount);
            } else {
              suffix = formatNumber(amount);
            }

            txs.push({
              ...transaction,
              chain: 'ethereum',
              type: 'Transfer',
              amount: suffix,
              date: date,
              jsDate: date2,
              asset: symbol,
            });
          } else if (transaction.functionName === 'approve(address _spender, uint256 _value)') {
            const contract = new ethers.Contract(transaction.to, erc20Abi, ethProvider);
            const decimals = await contract.decimals();
            const symbol = await contract.symbol();
            const decodedData = contract.interface.decodeFunctionData('approve', transaction.input);
            const amount = parseInt(decodedData[1]) / 10 ** parseInt(decimals);
            let suffix;

            if (amount > 1e30) {
              suffix = convertToStandardForm(amount);
            } else {
              suffix = formatNumber(amount);
            }
            const date2 = new Date(transaction.timeStamp * 1000);
            const day = date2.getDate();
            const month = date2.getMonth();
            const date = `${months[month]}, ${day}`;

            txs.push({
              ...transaction,
              chain: 'ethereum',
              type: 'Approve',
              amount: suffix,
              date: date,
              jsDate: date2,
              asset: symbol,
            });
          } else if (!transaction.functionName && transaction.value > 0) {
            const date2 = new Date(transaction.timeStamp * 1000);
            const day = date2.getDate();
            const month = date2.getMonth();
            const date = `${months[month]}, ${day}`;
            const amount = transaction.value / 1e18;
            let suffix;

            if (amount > 1e30) {
              suffix = convertToStandardForm(amount);
            } else {
              suffix = formatNumber(amount);
            }

            if (transaction.from === router.query.address) {
              txs.push({
                ...transaction,
                chain: 'ethereum',
                type: 'Send',
                amount: suffix,
                date: date,
                jsDate: date2,
                asset: 'ETH',
              });
            } else {
              txs.push({
                ...transaction,
                chain: 'ethereum',
                type: 'Receive',
                amount: suffix,
                date: date,
                jsDate: date2,
                asset: 'ETH',
              });
            }
          } else if (
            transaction.functionName.startsWith('swap') ||
            transaction.functionName.startsWith('exactInputSingle') ||
            transaction.functionName.startsWith('swapETHForExactTokens')
          ) {
            const date2 = new Date(transaction.timeStamp * 1000);
            const day = date2.getDate();
            const month = date2.getMonth();
            const date = `${months[month]}, ${day}`;

            if (transaction.to === oneInchV5) {
              try {
                const contract = new ethers.Contract(transaction.to, oneInchV5Abi, ethProvider);

                const decodedData = contract.interface.decodeFunctionData(
                  'swap',
                  transaction.input
                );

                const tokenIn = decodedData[1][0];
                const tokenOut = decodedData[1][1];

                const inContract = new ethers.Contract(tokenIn, erc20Abi, ethProvider);
                const outContract = new ethers.Contract(tokenOut, erc20Abi, ethProvider);

                const tokenInSymbol = await inContract.symbol();
                const tokenInDecimal = await inContract.decimals();
                const tokenOutSymbol = await outContract.symbol();
                const tokenOutDecimal = await outContract.decimals();

                const amount = parseInt(decodedData[1][4]) / 10 ** parseInt(tokenInDecimal);
                const receivedAmount =
                  parseInt(decodedData[1][5]) / 10 ** parseInt(tokenOutDecimal);

                let suffix;
                let receivedFixed;

                if (amount > 1e30) {
                  suffix = convertToStandardForm(amount);
                  receivedFixed = convertToStandardForm(receivedAmount);
                } else {
                  suffix = formatNumber(amount);
                  receivedFixed = formatNumber(receivedAmount);
                }

                txs.push({
                  ...transaction,
                  chain: 'ethereum',
                  type: 'Trade',
                  date: date,
                  jsDate: date2,
                  amount: suffix,
                  recieved: receivedFixed,
                  asset: tokenInSymbol,
                  token: tokenOutSymbol,
                });
              } catch (error) {
                // console.log(error)
              }
            } else if (transaction.to === UniswapV2) {
              console.log('v2');
            } else if (transaction.to === UniswapV3) {
              console.log('v3');
            }
          }
        })
      );

      if (typeof data?.bsc !== typeof 'string') {
        await Promise.all(
          data?.bsc?.map(async (transaction) => {
            if (transaction.functionName === 'transfer(address _to, uint256 _value)') {
              const contract = new ethers.Contract(transaction.to, erc20Abi, bscProvider);
              const decimals = await contract.decimals();
              const symbol = await contract.symbol();
              const decodedData = contract.interface.decodeFunctionData(
                'transfer',
                transaction.input
              );
              const amount = parseInt(decodedData[1]) / 10 ** parseInt(decimals);
              const date2 = new Date(transaction.timeStamp * 1000);
              const day = date2.getDate();
              const month = date2.getMonth();
              const date = `${months[month]}, ${day}`;
              let suffix;

              if (amount > 1e30) {
                suffix = convertToStandardForm(amount);
              } else {
                suffix = formatNumber(amount);
              }

              bscTxs.push({
                ...transaction,
                chain: 'bsc',
                type: 'Transfer',
                amount: suffix,
                date: date,
                jsDate: date2,
                asset: symbol,
              });
            } else if (transaction.functionName === 'approve(address _spender, uint256 _value)') {
              const contract = new ethers.Contract(transaction.to, erc20Abi, bscProvider);
              const decimals = await contract.decimals();
              const symbol = await contract.symbol();
              const decodedData = contract.interface.decodeFunctionData(
                'approve',
                transaction.input
              );
              const amount = parseInt(decodedData[1]) / 10 ** parseInt(decimals);
              let suffix;

              if (amount > 1e30) {
                suffix = convertToStandardForm(amount);
              } else {
                suffix = formatNumber(amount);
              }
              const date2 = new Date(transaction.timeStamp * 1000);
              const day = date2.getDate();
              const month = date2.getMonth();
              const date = `${months[month]}, ${day}`;

              bscTxs.push({
                ...transaction,
                chain: 'bsc',
                type: 'Approve',
                amount: suffix,
                date: date,
                jsDate: date2,
                asset: symbol,
              });
            } else if (!transaction.functionName && transaction.value > 0) {
              const date2 = new Date(transaction.timeStamp * 1000);
              const day = date2.getDate();
              const month = date2.getMonth();
              const date = `${months[month]}, ${day}`;
              const amount = transaction.value / 1e18;
              let suffix;

              if (amount > 1e30) {
                suffix = convertToStandardForm(amount);
              } else {
                suffix = formatNumber(amount);
              }

              if (transaction.from === userId) {
                bscTxs.push({
                  ...transaction,
                  chain: 'bsc',
                  type: 'Send',
                  amount: suffix,
                  date: date,
                  jsDate: date2,
                  asset: 'ETH',
                });
              } else {
                txs.push({
                  ...transaction,
                  chain: 'ethereum',
                  type: 'Receive',
                  amount: suffix,
                  date: date,
                  jsDate: date2,
                  asset: 'ETH',
                });
              }
            }
            // else if (
            //   transaction.functionName.startsWith("swap") ||
            //   transaction.functionName.startsWith("exactInputSingle") ||
            //   transaction.functionName.startsWith("swapETHForExactTokens")
            // ) {
            //   const date2 = new Date(transaction.timeStamp * 1000);
            //   const day = date2.getDate();
            //   const month = date2.getMonth();
            //   const date = `${months[month]}, ${day}`;

            //   if (transaction.to === oneInchV5) {
            //     try {
            //       const contract = new ethers.Contract(
            //         transaction.to,
            //         oneInchV5Abi,
            //         ethProvider
            //       );

            //       const decodedData = contract.interface.decodeFunctionData(
            //         "swap",
            //         transaction.input
            //       );

            //       const tokenIn = decodedData[1][0];
            //       const tokenOut = decodedData[1][1];

            //       const inContract = new ethers.Contract(
            //         tokenIn,
            //         erc20Abi,
            //         ethProvider
            //       );
            //       const outContract = new ethers.Contract(
            //         tokenOut,
            //         erc20Abi,
            //         ethProvider
            //       );

            //       const tokenInSymbol = await inContract.symbol();
            //       const tokenInDecimal = await inContract.decimals();
            //       const tokenOutSymbol = await outContract.symbol();
            //       const tokenOutDecimal = await outContract.decimals();

            //       const amount =
            //         parseInt(decodedData[1][4]) / 10 ** parseInt(tokenInDecimal);
            //       const receivedAmount =
            //         parseInt(decodedData[1][5]) / 10 ** parseInt(tokenOutDecimal);

            //       let suffix;
            //       let receivedFixed;

            //       if (amount > 1e30) {
            //         suffix = convertToStandardForm(amount);
            //         receivedFixed = convertToStandardForm(receivedAmount);
            //       } else {
            //         suffix = formatNumber(amount);
            //         receivedFixed = formatNumber(receivedAmount);
            //       }

            //       txs.push({
            //         ...transaction,
            //         chain: "ethereum",
            //         type: "Trade",
            //         date: date,
            //         jsDate: date2,
            //         amount: suffix,
            //         recieved: receivedFixed,
            //         asset: tokenInSymbol,
            //         token: tokenOutSymbol,
            //       });
            //     } catch (error) {
            //       // console.log(error)
            //     }
            //   } else if (transaction.to === UniswapV2) {
            //     console.log("v2");
            //   } else if (transaction.to === UniswapV3) {
            //     console.log("v3");
            //   }
            // }
          })
        );
      }
      const transactionsArr = [...txs, ...bscTxs];
      const sorted = transactionsArr.sort((a, b) => b.jsDate - a.jsDate);
      setHistory(sorted);
    };
    if (history.length === 0 && router.query.address) {
      setData(router.query.address);
    }
  }, [ethProvider, bscProvider, setHistory, history, router]);
  const slicedHistory = useMemo(() => history.slice(0, 100), [history]);
  return (
    <div className="pb-16 mt-10  min-h-screen justify-center items-center flex relative">
      <div
        onClick={() => {
          router.back();
        }}
        className="absolute top-[4px] md:bottom-0 left-7 md:top-0 md:left-16"
      >
        <KeyboardBackspaceRoundedIcon
          sx={{ fontSize: '30px' }}
          className="rounded-full p-1 bg-gray-200/60 w-9 text-blue-500 cursor-pointer"
        />
      </div>
      {history?.length > 0 ? (
        <HistoryList slicedHistory={slicedHistory} />
      ) : (
        <div>
          <Skeleton
            className="mx-auto w-[350px] lg:w-[700px] h-[3000px]"
            variant="text"
            height={600}
            sx={{ fontSize: '1rem' }}
          />
        </div>
      )}
    </div>
  );
};

export default History;
