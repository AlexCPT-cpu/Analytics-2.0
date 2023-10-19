import fetchBalNow from './fetchBalNow';

const getV3NowBal = async (tokenAddress, userAddress, pairAddress, token0, token1, web3) => {
  const balanceTime = await fetchBalNow(tokenAddress, userAddress, web3);

  const reserve0 = await fetchBalNow(token0, pairAddress, web3);

  const reserve1 = await fetchBalNow(token1, pairAddress, web3);

  return {
    reserve0: reserve0,
    reserve1: reserve1,
    balance: parseInt(balanceTime),
  };
};

export default getV3NowBal;
