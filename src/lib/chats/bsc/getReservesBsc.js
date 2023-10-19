import { pancakeFactoryV2, bscWBNB } from 'src/config/index';
import PancakeV2Abi from 'src/json/pancakeFactoryV2.json';
import getCakeV3Pair from 'src/libs/getCakeV3Pair';

const v2 = async (token, web3) => {
  const factory = new web3.eth.Contract(PancakeV2Abi, pancakeFactoryV2);
  const pair = await factory.methods.getPair(token, bscWBNB).call();
  return pair;
};

const getReservesBsc = async (web3, token) => {
  const pair = await getCakeV3Pair(bscWBNB, token);
  if (pair && pair !== null && pair != '0x0000000000000000000000000000000000000000') {
    return { pair: pair, exchange: 'PancakeV3', isAvail: true };
  } else {
    const v2Pair = await v2(token, web3);
    if (v2Pair && v2Pair != '0x0000000000000000000000000000000000000000') {
      return { pair: v2Pair, exchange: 'PancakeV2', isAvail: true };
    } else return null;
  }
};

export default getReservesBsc;
