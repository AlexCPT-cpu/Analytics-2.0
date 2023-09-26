import erc20Abi from 'src/json/erc20Abi.json';

const fetchBalance = async (contractAddress, walletAddress, blockNum, web3) => {
  const tokenContract = new web3.eth.Contract(erc20Abi, contractAddress);
  const balance = await tokenContract.methods.balanceOf(walletAddress).call({}, blockNum);
  return String(parseInt(balance));
};

export default fetchBalance;
