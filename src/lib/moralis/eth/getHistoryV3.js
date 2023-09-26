import PairAbiV3 from 'src/json/PairAbiV3.json';
import { getBalance, getNowBalance } from 'src/lib/getBalance';
import fetchBalance from './fetchBalance';
import getSerialisedV3data from './getSerialisedV3data';
import fetchPairs from './fetchPairs';

const getHistoryV3 = async (tokenAddress, web3, userAddress, pair, blocks) => {
  const prs = await fetchPairs(pair);
  const contract = new web3.eth.Contract(pair, PairAbiV3);
  const contract1 = new web3.eth.Contract(tokenAddress, erc20Abi);
  const contract0 = new web3.eth.Contract(WETH, erc20Abi);
  const createdHash = prs?.result[0].txHash;
  const tokenContract = new web3.eth.Contract(erc20Abi, tokenAddress);
  if (createdHash) {
    const transaction = await web3.eth.getTransaction(createdHash);
    const blockThen = await web3.eth.getBlock(parseInt(transaction.blockNumber));

    const token0 = await contract.methods.token0().call();
    const token1 = await contract.methods.token1().call();

    const reserveThen = await getBalance(
      pair,
      contract0,
      contract1,
      parseInt(transaction.blockNumber)
    );
    const reserveNow = await getNowBalance(contract, contract0, contract1);

    const balanceThen = await fetchBalance(
      tokenAddress,
      userAddress,
      parseInt(transaction.blockNumber),
      web3
    );
    const balanceNow = await tokenContract.methods.balanceOf(userAddress).call();

    const tokenDetails = {
      token0,
      token1,
    };
    const resultThen = {
      reserve0: reserveThen[0],
      reserve1: reserveThen[1],
      balance: balanceThen,
    };
    const resultNow = {
      reserve0: reserveNow[0],
      reserve1: reserveNow[1],
      balance: balanceNow,
    };
    const balancesFetcher = blocks.map(async (block) => {
      try {
        if (parseInt(blockThen?.timestamp) < block.timestamp) {
          const resultTime = await getSerialisedV3data(
            tokenAddress,
            userAddress,
            pair,
            token0,
            token1,
            web3,
            parseInt(block.block)
          );

          return resultTime;
        } else {
          return resultThen;
        }
      } catch (error) {
        console.log(error);
      }
    });
    const dates = await Promise.all(balancesFetcher);

    return [
      {
        maxReserve: resultThen,
        nowReserve: resultNow,
        dates,
      },
      tokenDetails,
    ];
  }
};

export default getHistoryV3;
