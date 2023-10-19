import erc20Abi from 'src/json/erc20Abi.json';

const fetchBalNow = async (contractAddress, walletAddress, web3) => {
  const tokenContract = new web3.eth.Contract(erc20Abi, contractAddress);
  const balance = await tokenContract.methods.balanceOf(walletAddress).call();
  return parseInt(balance);
};

export default fetchBalNow;
