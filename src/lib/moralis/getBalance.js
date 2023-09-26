import erc20Abi from "../json/erc20Abi.json" assert { type: "json" };

const getBalance = async (tokenAddress, userAddress, web3, block) => {
  let bal = 0;
  try {
    const contract = new web3.eth.Contract(erc20Abi, tokenAddress);
    const balance = await contract.balanceOf(userAddress).call({}, block);
    bal = parseInt(balance);
  } catch (error) {
    bal = 0;
  }

  return parseInt(bal);
};

export default getBalance;
