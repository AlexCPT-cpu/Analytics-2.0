import fetchBalance from "./fetchBalance";
import formatDate from "../../formatDate";

const getSerialisedV3data = async (
  tokenAddress,
  userAddress,
  pairAddress,
  token0,
  token1,
  web3,
  block,
  token,
  timestamp
) => {
  const balanceTime = await fetchBalance(
    tokenAddress,
    userAddress,
    parseInt(block),
    web3
  );

  const reserve0 = await fetchBalance(
    token0,
    pairAddress,
    parseInt(block),
    web3
  );

  const reserve1 = await fetchBalance(
    token1,
    pairAddress,
    parseInt(block),
    web3
  );
  const times = formatDate(new Date(Math.floor(parseInt(timestamp) * 1000)));
  return {
    reserve0: reserve0,
    reserve1: reserve1,
    balance: balanceTime,
    pair: token.pair,
    decimal: token.decimal,
    time: times,
  };
};

export default getSerialisedV3data;
