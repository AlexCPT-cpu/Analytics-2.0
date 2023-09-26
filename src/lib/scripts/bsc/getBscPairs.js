import getSeralizedData from "../../bsc/getSeralisedData.js";
import getSeralisedV3data from "../../bsc/v3/getSerialisedV3data.js";
import PairAbi from "../../json/pancakePairV2.json" assert { type: "json" };
import { getEthBalance } from "../../lib/getEthBalance.js";
import formatDate from "../../scripts/formatDate.js";
import getValueByTimestamp from "../../helpers/getValueByTimestamp.js";
import axios from "axios";
import { bearerToken } from "../../config/config.js";

export const getBscPairs = async (response, web3Bsc, timings) => {
  console.log(" Getting bsc pairs");
  const bscPairs = [];

  for (const pair of response.bsc) {
    const times = await Promise.all(
      timings.bscTimings.map(async (blocks) => {
        const timedArr = [];
        for (const block of blocks) {
          if (pair.pair.exchange === "V2") {
            if (pair.maxReserve._blockTimestampLast < block.timestamp) {
              const contract = new web3Bsc.eth.Contract(
                PairAbi,
                pair.pair.pair
              );
              const serializedTime = await getSeralizedData(
                pair.address,
                response.address,
                contract,
                parseInt(block.number),
                web3Bsc
              );

              const time = formatDate(
                new Date(Math.floor(block.timestamp * 1000))
              );

              timedArr.push({
                ...serializedTime,
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
          } else {
            if (pair.maxReserve._blockTimestampLast < block.timestamp) {
              const resultTime = await getSeralisedV3data(
                pair.address,
                pair.pair.pair,
                pair.pair.token0,
                pair.pair.token1,
                web3Bsc,
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

    bscPairs.push(times);
  }
  console.log(" Getting bsc balances");
  const bnbBalances = await Promise.all(
    timings.bscTimings.map(async (blocks) => {
      const timedArr = [];
      for (const block of blocks) {
        const data = await getEthBalance(
          response.address,
          parseInt(block.number),
          web3Bsc
        );
        timedArr.push(data);
      }
      return timedArr;
    })
  );
  console.log(" Getting bsc prices");

  const bnbPrices = [];
  const dataResponse = await axios.get(
    "https://api.app-mobula.com/api/1/market/history?asset=bnb",
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

  for (const blocks of timings.bscTimings) {
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
    bnbPrices.push(timedArr);
  }
  return {
    bscPairs,
    bnbBalances,
    bnbPrices,
  };
};
