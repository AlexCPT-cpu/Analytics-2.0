import { WETH } from '../config/index';
import calculateTokenPrice from './calculateTokenPrice';

const getBalanceDetails = (balance, ethData, chain) => {
  const isWeth = String(balance?.reserves[1]?.token0).toLowerCase() === String(WETH).toLowerCase();
  const wethDecimals = 18;
  const tokenDecimals = balance.decimals;
  const reserves = balance?.reserves[0];
  const now = reserves?.nowReserve;
  const hour = reserves?.dates[0];

  const nowPriceEth = isWeth
    ? calculateTokenPrice(now?.reserve1, now?.reserve0, tokenDecimals, wethDecimals)
    : calculateTokenPrice(now?.reserve0, now?.reserve1, tokenDecimals, wethDecimals);

  const hourPriceEth = isWeth
    ? calculateTokenPrice(hour?.reserve1, hour?.reserve0, tokenDecimals, wethDecimals)
    : calculateTokenPrice(hour?.reserve0, hour?.reserve1, tokenDecimals, wethDecimals);

  const nowPrice = ethData?.eth_PriceNow;
  const hourPrice = ethData?.eth_Price1H;

  return {
    nowPriceBal: nowPriceEth * (parseInt(balance?.balance) / 10 ** tokenDecimals),
    hourPriceBal: hourPriceEth * (hour?.balance / 10 ** tokenDecimals),
    token: balance,
    nowPrice,
    tokenPriceEth: nowPriceEth,
    hourPrice,
    hourPriceEth,
    hourBalance: hour?.balance,
    balance: parseInt(balance?.balance) / 10 ** tokenDecimals,
    chain: chain,
  };
};

export default getBalanceDetails;
