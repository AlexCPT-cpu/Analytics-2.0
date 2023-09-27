import { WETH } from 'src/config/index';
import { WBNB } from 'src/config/index';
import calculateTokenPrice from 'src/lib/calculateTokenPrice';
import formatDate from 'src/lib/formatDate';

const formatTier = (tier, allData, bscData) => {
  const BnbtierMaps = tier?.bscData?.bscData?.map((items) => {
    const dollarValues = items?.map((item, index) => {
      const date = formatDate(new Date(Number(item?.reserves?.timestamp) * 1000));
      let usdValue;
      const isWeth = String(item?.pair?.token0).toLowerCase() === String(WBNB).toLowerCase();

      const wethDecimals = 18;
      const tokenDecimals = item?.decimals;
      const nowPriceEth = isWeth
        ? calculateTokenPrice(
            item?.reserves?.reserve1,
            item?.reserves?.reserve0,
            tokenDecimals,
            wethDecimals
          )
        : calculateTokenPrice(
            item?.reserves?.reserve0,
            item?.reserves?.reserve1,
            tokenDecimals,
            wethDecimals
          );
      const ethPrice = (nowPriceEth * Number(item?.reserves?.balance)) / 10 ** tokenDecimals;

      if (index === 0) {
        usdValue = bscData?.bnbData?.bnb_PriceNow * ethPrice;
      } else if (index === 1) {
        usdValue = tier?.bscData?.bnb_Prices?.bnb_Price0 * ethPrice;
      } else if (index === 2) {
        usdValue = tier?.bscData?.bnb_Prices?.bnb_Price1 * ethPrice;
      } else if (index === 3) {
        usdValue = tier?.bscData?.bnb_Prices?.bnb_Price2 * ethPrice;
      } else if (index === 4) {
        usdValue = tier?.bscData?.bnb_Prices?.bnb_Price3 * ethPrice;
      }
      return { value: usdValue, time: date };
    });
    return dollarValues;
  });
  const EthtierMaps = tier?.ethData?.ethData?.map((items) => {
    const dollarValues = items?.map((item, index) => {
      const date = formatDate(new Date(Number(item?.reserves?.timestamp) * 1000));
      let usdValue;
      const isWeth = String(item?.pair?.token0).toLowerCase() === String(WETH).toLowerCase();

      const wethDecimals = 18;
      const tokenDecimals = item?.decimals;
      const nowPriceEth = isWeth
        ? calculateTokenPrice(
            item?.reserves?.reserve1,
            item?.reserves?.reserve0,
            tokenDecimals,
            wethDecimals
          )
        : calculateTokenPrice(
            item?.reserves?.reserve0,
            item?.reserves?.reserve1,
            tokenDecimals,
            wethDecimals
          );
      const ethPrice = (nowPriceEth * Number(item.reserves.balance)) / 10 ** tokenDecimals;

      if (index === 0) {
        usdValue = allData?.ethData?.ethPrices?.eth_PriceNow * ethPrice;
      } else if (index === 1) {
        usdValue = tier?.ethData?.eth_Prices?.eth_Price0 * ethPrice;
      } else if (index === 2) {
        usdValue = tier?.ethData?.eth_Prices?.eth_Price1 * ethPrice;
      } else if (index === 3) {
        usdValue = tier?.ethData?.eth_Prices?.eth_Price2 * ethPrice;
      } else if (index === 4) {
        usdValue = tier?.ethData?.eth_Prices?.eth_Price3 * ethPrice;
      }
      return { value: usdValue, time: date };
    });
    return dollarValues;
  });

  const sumsBsc = [];
  const sumsEth = [];
  if (BnbtierMaps.length > 0) {
    for (let i = 0; i < 5; i++) {
      try {
        let sum = 0;
        BnbtierMaps?.forEach((subArray) => {
          if (subArray) {
            sum += subArray[i]?.value;
          }
        });
        if (BnbtierMaps[0] !== null || undefined) {
          if (BnbtierMaps[0][i] !== null || undefined) {
            sumsBsc?.push({
              value: sum,
              time: BnbtierMaps[0][i]?.time,
            });
          }
        }
      } catch (error) {
        console.log(error);
      }
    }
  }

  if (EthtierMaps.length > 0) {
    for (let i = 0; i < 5; i++) {
      try {
        let sum = 0;
        EthtierMaps?.forEach((subArray) => {
          if (subArray) {
            sum += subArray[i]?.value;
          }
        });
        if (EthtierMaps[0] !== null || undefined) {
          if (EthtierMaps[(0)[i]] !== null || undefined)
            sumsEth?.push({
              value: sum,
              time: EthtierMaps[0][i]?.time,
            });
        }
      } catch (error) {
        console.log(error);
      }
    }
  }

  const item0 = sumsBsc[4]?.value
    ? sumsBsc[4]?.value
    : 0 + sumsEth[4]?.value
    ? sumsEth[4]?.value
    : 0;

  const item1 = sumsBsc[3]?.value
    ? sumsBsc[3]?.value
    : 0 + sumsEth[3]?.value
    ? sumsEth[3]?.value
    : 0;

  const item2 = sumsBsc[2]?.value
    ? sumsBsc[2]?.value
    : 0 + sumsEth[2]?.value
    ? sumsEth[2]?.value
    : 0;

  const item3 = sumsBsc[1]?.value
    ? sumsBsc[1]?.value
    : 0 + sumsEth[1]?.value
    ? sumsEth[1]?.value
    : 0;

  const item4 = sumsBsc[0]?.value
    ? sumsBsc[0]?.value
    : 0 + sumsEth[0]?.value
    ? sumsEth[0]?.value
    : 0;
  const tierFinal = [
    {
      value: item0,
      time: sumsBsc[4]?.time !== null || undefined ? sumsBsc[4]?.time : sumsEth[4]?.time,
    },
    {
      value: item1,
      time: sumsBsc[3]?.time !== null || undefined ? sumsBsc[3]?.time : sumsEth[3]?.time,
    },
    {
      value: item2,
      time: sumsBsc[2]?.time !== null || undefined ? sumsBsc[2]?.time : sumsEth[2]?.time,
    },
    {
      value: item3,
      time: sumsBsc[1]?.time !== null || undefined ? sumsBsc[1]?.time : sumsEth[1]?.time,
    },
    {
      value: item4,
      time: sumsBsc[0]?.time !== null || undefined ? sumsBsc[0]?.time : sumsEth[0]?.time,
    },
  ];
  return {
    tier0: tierFinal,
    ethValue: sumsEth[4]?.value ? sumsEth[4]?.value : 0,
    bscValue: sumsBsc[4]?.value ? sumsBsc[4]?.value : 0,
  };
};

export default formatTier;
