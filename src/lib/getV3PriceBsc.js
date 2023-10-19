import { FeeAmount } from '@uniswap/v3-sdk';
import { ethers } from 'ethers';
import { bscWBNB } from 'src/config/index';
import PancakeQuoter from 'src/config/PancakeQuoter';

const getV3PriceNow = async (token, prov, decimals, fee) => {
  try {
    const tokenDecimals = 10 ** decimals;
    const quoterV2 = '0xB048Bbc1Ee6b733FFfCFb9e9CeF7375518e25997';

    const provider = new ethers.JsonRpcProvider(prov);
    const quoterContract = new ethers.Contract(quoterV2, PancakeQuoter, provider);

    const quotedAmountOut = await quoterContract.quoteExactInputSingle.staticCall([
      token,
      bscWBNB,
      (1 * tokenDecimals).toString(),
      fee,
      0,
    ]);
    return parseInt(quotedAmountOut);
  } catch (error) {
    return null;
  }
};

export const fetchV3PriceBsc = async (token, prov, decimals) => {
  const feeTiers = [FeeAmount.LOWEST, FeeAmount.LOW, FeeAmount.MEDIUM, FeeAmount.HIGH];
  for (const feeTier of feeTiers) {
    try {
      const ethPrice = await getV3PriceNow(token, prov, decimals, feeTier);
      if (ethPrice) {
        return { ethPrice: ethPrice, fee: parseInt(feeTier) };
      }
    } catch (error) {
      console.error(`Error fetching V3 Pool Bsc`);
    }
  }
  return null;
};

export const getV3PriceTimeBsc = async (token, prov, decimals, fee, block) => {
  try {
    const tokenDecimals = 10 ** decimals;
    const quoterV2 = '0xB048Bbc1Ee6b733FFfCFb9e9CeF7375518e25997';

    const provider = new ethers.JsonRpcProvider(prov);
    const quoterContract = new ethers.Contract(quoterV2, PancakeQuoter, provider);

    const quotedAmountOut = await quoterContract.quoteExactInputSingle.staticCall(
      [token, bscWBNB, (1 * tokenDecimals).toString(), fee, 0],
      {
        blockTag: block,
      }
    );
    return parseInt(quotedAmountOut);
  } catch (error) {
    return null;
  }
};
