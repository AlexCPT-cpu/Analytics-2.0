import axios from 'axios';

const ethPrice = async (timestamp) => {
  const response = await axios.get(`https://min-api.cryptocompare.com/data/pricehistorical`, {
    params: {
      fsym: 'ETH',
      tsyms: 'USD',
      ts: timestamp,
    },
  });
  const ethPriceAtTimestamp = response.data.ETH.USD;

  return ethPriceAtTimestamp;
};

const ethPriceNow = async () => {
  const response = await axios.get(`https://min-api.cryptocompare.com/data/pricehistorical`, {
    params: {
      fsym: 'ETH',
      tsyms: 'USD',
      ts: new Date().getTime(),
    },
  });
  const ethPriceAtTimestamp = response.data.ETH.USD;

  return ethPriceAtTimestamp;
};

const coinInfo = async (contract) => {
  const { data } = await axios.get(
    `https://api.coingecko.com/api/v3/coins/ethereum/contract/${contract}`
  );
  return data;
};

const marketChart = async (contract, days) => {
  const { data } = await axios.get(
    `https://api.coingecko.com/api/v3/coins/ethereum/contract/${contract}/market_chart/?vs_currency=usd&days=${days}`
  );
  return data;
};
const marketChartRange = async (contract, start, end) => {
  const { data } = await axios.get(
    `https://api.coingecko.com/api/v3/coins/ethereum/contract/${contract}/market_chart/range?vs_currency=usd&from=${start}&to=${end}`
  );
  return data;
};

export { ethPriceNow, ethPrice, coinInfo, marketChart, marketChartRange };
