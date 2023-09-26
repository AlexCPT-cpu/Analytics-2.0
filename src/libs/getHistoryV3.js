import PairAbiV3 from 'src/json/pancakePairV3.json';
import getSerialisedV3data from 'src/lib/moralis/eth/getSerialisedV3data';

const getHistoryV3 = async (tokenAddress, web3, userAddress, pair, block, maxReserve) => {
  const contract = new web3.eth.Contract(pair, PairAbiV3);

  const token0 = await contract.methods.token0().call();
  const token1 = await contract.methods.token1().call();

  if (parseInt(maxReserve?.timestamp) < block.timestamp) {
    const resultTime = await getSerialisedV3data(
      tokenAddress,
      userAddress,
      pair,
      token0,
      token1,
      web3,
      parseInt(block.block)
    );

    return { ...resultTime };
  } else {
    return { ...maxReserve };
  }
};

export default getHistoryV3;
