import { bscProvider, bscProvider2, nodeRealBsc } from 'src/config/index';
import { delay } from 'src/helpers/delay';
import { erc20Abi } from 'src/json/erc20Abi';
import Web3 from 'web3';

const providerBsc = new Web3.providers.HttpProvider(bscProvider);

const web3 = new Web3(providerBsc);

const fetchPairBalance = async (contractAddress, walletAddress, blockNum) => {
  try {
    await delay(50);
    const tokenContract = new web3.eth.Contract(erc20Abi, contractAddress);
    const balance = parseInt(
      await tokenContract.methods.balanceOf(walletAddress).call({}, parseInt(blockNum))
    );

    return balance;
  } catch (error) {
    console.log(error.message);
  }
};
export default fetchPairBalance;
