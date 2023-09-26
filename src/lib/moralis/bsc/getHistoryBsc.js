import PairAbi from 'src/json/pancakePairV2.json';
import erc20Abi from 'src/json/erc20Abi.json';
import fetchPairs from './fetchPairs';
import fetchBalance from './fetchBalance';

const getHistoryBsc = async (tokenAddress, web3, userAddress, pair, blocks) => {
  const contract = new web3.eth.Contract(PairAbi, pair);

  const tokenContract = new web3.eth.Contract(erc20Abi, tokenAddress);

  const token0 = await contract.methods.token0().call();
  const token1 = await contract.methods.token1().call();

  const resultNow = await contract.methods.getReserves().call();
  const prs = await fetchPairs(pair);

  const balanceNow = await tokenContract.methods.balanceOf(userAddress).call();

  const createdHash = prs?.result[0].txHash;

  if (createdHash) {
    const transaction = await web3.eth.getTransaction(createdHash);
    const blockThen = await web3.eth.getBlock(parseInt(transaction.blockNumber));

    const balanceThen = await fetchBalance(
      tokenAddress,
      userAddress,
      parseInt(transaction.blockNumber),
      web3
    );

    const resultThen = await contract.methods
      .getReserves()
      .call({}, parseInt(transaction.blockNumber));

    const serializedThen = {
      reserve0: resultThen._reserve0.toString(),
      reserve1: resultThen._reserve1.toString(),
      timestamp: resultThen._blockTimestampLast.toString(),
      balance: balanceThen.toString(),
    };

    const serializedNow = {
      reserve0: resultNow._reserve0.toString(),
      reserve1: resultNow._reserve1.toString(),
      timestamp: resultNow._blockTimestampLast.toString(),
      balance: balanceNow.toString(),
    };

    const balancesFetcher = blocks.map(async (block) => {
      try {
        if (parseInt(blockThen?.timestamp) < block.timestamp) {
          const balanceTime = await fetchBalance(
            tokenAddress,
            userAddress,
            parseInt(block.block),
            web3
          );
          const resultTime = await contract.methods.getReserves().call({}, parseInt(block.block));

          const serializedTime = {
            reserve0: resultTime._reserve0.toString(),
            reserve1: resultTime._reserve1.toString(),
            timestamp: resultTime._blockTimestampLast.toString(),
            block,
            balance: balanceTime,
          };

          return serializedTime;
        } else {
          return serializedThen;
        }
      } catch (error) {
        console.log(error);
      }
    });
    const dates = await Promise.all(balancesFetcher);

    const tokenDetails = {
      token0,
      token1,
    };

    return [
      {
        maxReserve: serializedThen,
        nowReserve: serializedNow,
        dates,
      },
      tokenDetails,
    ];
  }
};

export default getHistoryBsc;
