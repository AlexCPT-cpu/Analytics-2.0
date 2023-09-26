import { pancakeFactoryV2, pancakeFactoryV3, bscWBNB } from 'src/config/index';
import PancakeV2Abi from 'src/json/pancakeFactoryV2.json';
import PancakeV3Abi from 'src/json/pancakeFactoryV3.json';

const v2 = async (token, web3) => {
  const factory = new web3.eth.Contract(PancakeV2Abi, pancakeFactoryV2);
  const pair = await factory.methods.getPair(token, bscWBNB).call();
  return pair;
};

const v3 = async (token, web3) => {
  const factory = new web3.eth.Contract(PancakeV3Abi, pancakeFactoryV3);

  const pairV3_100 = await factory.methods.getPool(token, bscWBNB, 100).call();

  if (pairV3_100 && pairV3_100 !== '0x0000000000000000000000000000000000000000') {
    return pairV3_100;
  } else {
    const pairV3_500 = await factory.methods.getPool(token, bscWBNB, 500).call();
    if (pairV3_500 && pairV3_500 !== '0x0000000000000000000000000000000000000000') {
      return pairV3_500;
    } else {
      const pairV3_1000 = await factory.methods.getPool(token, bscWBNB, 1000).call();
      if (pairV3_1000 && pairV3_1000 !== '0x0000000000000000000000000000000000000000') {
        return pairV3_1000;
      } else {
        return null;
      }
    }
  }
};

const getReservesBsc = async (web3, token) => {
  const v2Pair = await v2(token, web3);
  if (v2Pair && v2Pair != '0x0000000000000000000000000000000000000000') {
    return { pair: v2Pair, exchange: 'PancakeV2', isAvail: true };
  } else {
    const pair = await v3(token, web3);
    if (pair && pair !== '0x0000000000000000000000000000000000000000') {
      return { pair: pair, exchange: 'PancakeV3', isAvail: true };
    } else {
      return { isAvail: false };
    }
  }
};

export default getReservesBsc;
