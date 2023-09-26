import axios from 'axios';
import { factoryV2, moralisKey } from 'src/config/index';
import { CircularReplacer, Stringify } from 'src/helpers/CircularReplacer';
import UniswapV2Abi from 'src/json/factoryV2Abi.json';

const v2 = async (token0Address, token1Address, web3) => {
  try {
    const factory = new web3.eth.Contract(UniswapV2Abi, factoryV2);
    const pair = await factory.methods.getPair(token0Address, token1Address).call();
    return pair;
  } catch (error) {
    console.log(error.message, 'no pair');
  }
};

const v3 = async (token0Address, token1Address) => {
  try {
    // const response = await Moralis.EvmApi.defi.getPairAddress({
    //   token0Address,
    //   token1Address,
    //   chain,
    //   exchange: 'uniswapv3',
    // });
    const url = `https://deep-index.moralis.io/api/v2/${token0Address}/${token1Address}/pairAddress?chain=eth&exchange=uniswapv3`;

    const x = await axios.get(url, {
      headers: {
        Accept: 'application/json',
        'X-API-Key': moralisKey,
      },
    });

    const obj = Stringify(x?.data, CircularReplacer);
    if (obj.pairAddress) {
      return obj;
    }
    return obj;
  } catch (error) {
    //console.log(error.message);
  }
};
const getReserves = async (token0Address, token1Address, web3) => {
  const v2Pair = await v2(token0Address, token1Address, web3);
  if (v2Pair && v2Pair != '0x0000000000000000000000000000000000000000') {
    return { pair: v2Pair, exchange: 'UniswapV2', isAvail: true };
  } else {
    const pair = await v3(token0Address, token1Address);

    if (pair && pair !== '0x0000000000000000000000000000000000000000') {
      return { pair: pair.pairAddress, exchange: 'UniswapV3', isAvail: true };
    } else {
      const pair2 = await v3(token1Address, token0Address);
      if (pair2 && pair2 !== '0x0000000000000000000000000000000000000000') {
        return { pair: pair2.pairAddress, exchange: 'UniswapV3', isAvail: true };
      } else return { isAvail: false };
    }
  }
};

export default getReserves;
