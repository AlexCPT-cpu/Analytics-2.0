const getBalancez = async (address, blockNumber, web3) => {
  const data = await web3.eth.getBalance(address, blockNumber);
  const parsed = parseInt(data) / 1e18;
  return parsed;
};

export default getBalancez;
