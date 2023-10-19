import Web3 from 'web3';

const getBalances = async (address, web3Arr, blocks) => {
  const getBalancez = async (address, blockNumber, web3) => {
    const data = await web3.eth.getBalance(address, blockNumber);
    const parsed = parseInt(data) / 1e18;
    return parsed;
  };

  const getBalanceNow = async (address, provider) => {
    const web3 = new Web3(provider);
    const data = await web3.eth.getBalance(address);
    const parsed = parseInt(data) / 1e18;
    return parsed;
  };

  const chainBalances = async (address, web3Array, blocks) => {
    const ethBalances = await Promise.all(
      blocks.map(async (block, i) => {
        const index = i % web3Array.length;
        const provider = web3Array[index];
        const web3 = new Web3(provider);
        const data = await getBalancez(address, block.block, web3);
        return data;
      })
    );
    const balanceNow = await getBalanceNow(address, web3Arr[0]);
    return {
      balances: ethBalances,
      balanceNow,
    };
  };
  const balanceNow = await getBalanceNow(address, web3Arr[0]);
  const balances = await chainBalances(address, web3Arr, blocks);
  return {
    balanceNow,
    balances,
  };
};

export default getBalances;
