const getBalances = async (address, web3, blocks) => {
  const getBalancez = async (address, blockNumber, web3) => {
    const data = await web3.eth.getBalance(address, blockNumber);
    const parsed = parseInt(data) / 1e18;
    return parsed;
  };

  const getBalanceNow = async (address, web3) => {
    const data = await web3.eth.getBalance(address);
    const parsed = parseInt(data) / 1e18;
    return parsed;
  };

  const chainBalances = async (address, web3, blocks) => {
    const ethBalances = await Promise.all(
      blocks.map(async (block) => {
        const data = await getBalancez(address, block.block, web3);
        return data;
      })
    );
    const balanceNow = await getBalanceNow(address, web3);
    return {
      balances: ethBalances,
      balanceNow,
    };
  };
  const balanceNow = await getBalanceNow(address, web3);
  const balances = await chainBalances(address, web3, blocks);
  return {
    balanceNow,
    balances,
  };
};

export default getBalances;
