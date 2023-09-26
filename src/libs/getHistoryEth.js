import PairAbi from 'src/json/pancakePairV2.json';
import fetchBalance from 'src/lib/moralis/eth/fetchBalance';

const getHistoryEth = async (tokenAddress, web3, userAddress, pair, block, maxReserve) => {
  const contract = new web3.eth.Contract(PairAbi, pair);

  if (parseInt(maxReserve?.timestamp) < block.timestamp) {
    const balanceTime = await fetchBalance(tokenAddress, userAddress, parseInt(block.block), web3);
    const resultTime = await contract.methods.getReserves().call({}, parseInt(block.block));

    const serializedTime = {
      reserve0: resultTime._reserve0.toString(),
      reserve1: resultTime._reserve1.toString(),
      timestamp: resultTime._blockTimestampLast.toString(),
      block,
      balance: balanceTime,
    };

    return { ...serializedTime };
  } else {
    return { ...maxReserve };
  }
};

export default getHistoryEth;
