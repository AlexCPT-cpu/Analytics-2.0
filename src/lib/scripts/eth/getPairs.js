import getSerialisedV3data from "../../eth/v3/getSerialisedV3data.js";
import fetchBalance from "../../src/fetchBalance.js";
import PairAbi from "../../json/PairAbi.json" assert { type: "json" };
import formatDate from "../../scripts/formatDate.js";
import { getEthBalance } from "../../lib/getEthBalance.js";
import { bearerToken } from "../../config/config.js";
import getValueByTimestamp from "../../helpers/getValueByTimestamp.js";
import axios from "axios";

export const getPairs = async (response, web3Eth, timings) => {
  console.log(" Getting eth pairs");
  const ethPairs = [];
  for (const pair of response.eth) {
    const times = await Promise.all(
      timings.ethTimings.map(async (blocks) => {
        const timedArr = [];
        for (const block of blocks) {
          if (pair.pair.exchange === "V2") {
            if (pair.maxReserve._blockTimestampLast < block.timestamp) {
              const contract = new web3Eth.eth.Contract(
                PairAbi,
                pair.pair.pair
              );
              const balanceTime = await fetchBalance(
                pair.address,
                response.address,
                parseInt(block.number),
                web3Eth
              );
              const resultTime = await contract.methods
                .getReserves()
                .call({}, parseInt(block.number));
              const time = formatDate(
                new Date(Math.floor(block.timestamp * 1000))
              );

              const serializedTime = {
                ...resultTime,
                0: resultTime["0"].toString(),
                1: resultTime["1"].toString(),
                2: resultTime["2"].toString(),
                __length__: resultTime.__length__.toString(),
                _reserve0: resultTime._reserve0.toString(),
                _reserve1: resultTime._reserve1.toString(),
                _blockTimestampLast: resultTime._blockTimestampLast.toString(),
                block,
                balance: balanceTime,
                decimal: pair.decimal,
                isWeth: pair.pair.token0 === pair.address ? 0 : 1,
                time,
              };

              timedArr.push(serializedTime);
            } else {
              const time = formatDate(
                new Date(Math.floor(block.timestamp * 1000))
              );
              timedArr.push({
                ...pair.maxReserve,
                decimal: pair.decimal,
                isWeth: pair.pair.token0 === pair.address ? 0 : 1,
                time,
              });
            }
          } else {
            if (pair.maxReserve._blockTimestampLast < block.timestamp) {
              const resultTime = await getSerialisedV3data(
                pair.address,
                response.address,
                pair.pair.pair,
                pair.pair.token0,
                pair.pair.token1,
                web3Eth,
                parseInt(block.number)
              );
              const time = formatDate(
                new Date(Math.floor(block.timestamp * 1000))
              );
              timedArr.push({
                ...resultTime,
                decimal: pair.decimal,
                isWeth: pair.pair.token0 === pair.address ? 0 : 1,
                time,
              });
            } else {
              const time = formatDate(
                new Date(Math.floor(block.timestamp * 1000))
              );
              timedArr.push({
                ...pair.maxReserve,
                decimal: pair.decimal,
                isWeth: pair.pair.token0 === pair.address ? 0 : 1,
                time,
              });
            }
          }
        }
        return { timedArr, nowReserve: pair.nowReserve };
      })
    );
    ethPairs.push(times);
  }
  console.log(" Getting eth balances");
  const ethBalances = await Promise.all(
    timings.ethTimings.map(async (blocks) => {
      const timedArr = [];
      for (const block of blocks) {
        const data = await getEthBalance(
          response.address,
          parseInt(block.number),
          web3Eth
        );
        timedArr.push(data);
      }
      return timedArr;
    })
  );
  console.log(" Getting eth prices");
  const ethPrices = [];
  const dataResponse = await axios.get(
    "https://api.app-mobula.com/api/1/market/history?asset=ethereum",
    {
      headers: {
        Authorization: bearerToken,
      },
    }
  );

  const format = dataResponse.data.data.price_history.map((item) => ({
    timestamp: item[0],
    price: item[1],
  }));

  for (const blocks of timings.ethTimings) {
    const timedArr = await Promise.all(
      blocks.map(async (block) => {
        const timeStamp = Math.floor(block.timestamp * 1000);
        const value = await getValueByTimestamp(timeStamp, format);
        if (value) {
          return value;
        } else {
          return format[format.length - 1].price;
        }
      })
    );
    ethPrices.push(timedArr);
  }
  return {
    ethPairs,
    ethBalances,
    ethPrices,
  };
};
