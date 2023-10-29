import { FeeAmount } from '@uniswap/v3-sdk';
import { ethers } from 'ethers';
import { WETH } from 'src/config//index';
import QuoterV2 from 'src/config/QuoterV2';

export const getV3PriceNow = async (token, prov, decimals, fee) => {
  try {
    const tokenDecimals = 10 ** decimals;
    const quoterV2 = '0x61fFE014bA17989E743c5F6cB21bF9697530B21e';

    const provider = new ethers.JsonRpcProvider(prov);
    const quoterContract = new ethers.Contract(quoterV2, QuoterV2, provider);

    const quotedAmountOut = await quoterContract.quoteExactInputSingle.staticCall([
      token,
      WETH,
      (1 * tokenDecimals).toString(),
      fee,
      0,
    ]);
    return parseInt(quotedAmountOut);
  } catch (error) {
    return null;
  }
};

export const fetchV3Price = async (token, prov, decimals) => {
  const feeTiers = [FeeAmount.LOWEST, FeeAmount.LOW, FeeAmount.MEDIUM, FeeAmount.HIGH];
  for (const feeTier of feeTiers) {
    try {
      const ethPrice = await getV3PriceNow(token, prov, decimals, feeTier);
      if (ethPrice) {
        return { ethPrice: ethPrice, fee: parseInt(feeTier) };
      }
    } catch (error) {
      console.error(`Error fetching V3 Pool Eth`);
    }
  }
  return null;
};

export const getV3PriceTime = async (token, prov, decimals, fee, block) => {
  try {
    const tokenDecimals = 10 ** decimals;
    const quoterV2 = '0x61fFE014bA17989E743c5F6cB21bF9697530B21e';

    const provider = new ethers.JsonRpcProvider(prov);
    const quoterContract = new ethers.Contract(quoterV2, QuoterV2, provider);

    const quotedAmountOut = await quoterContract.quoteExactInputSingle.staticCall(
      [token, WETH, (1 * tokenDecimals).toString(), fee, 0],
      {
        blockTag: block,
      }
    );
    return parseInt(quotedAmountOut);
  } catch (error) {
    console.log(error);
    return null;
  }
};
