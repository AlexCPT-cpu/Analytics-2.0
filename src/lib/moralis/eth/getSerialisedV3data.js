import fetchBalance from './fetchBalance';

const getSerialisedV3data = async (
  tokenAddress,
  userAddress,
  pairAddress,
  token0,
  token1,
  web3,
  block
) => {
  const balanceTime = await fetchBalance(tokenAddress, userAddress, parseInt(block), web3);

  const reserve0 = await fetchBalance(token0, pairAddress, parseInt(block), web3);

  const reserve1 = await fetchBalance(token1, pairAddress, parseInt(block), web3);

  return {
    reserve0: parseInt(reserve0),
    reserve1: parseInt(reserve1),
    balance: parseInt(balanceTime),
  };
};

export default getSerialisedV3data;
