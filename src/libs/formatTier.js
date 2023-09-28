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

  const bscLength = sumsBsc.length > 0 ? true : false;
  const ethLength = sumsEth.length > 0 ? true : false;

  const item0 = bscLength ? sumsBsc[4]?.value : 0 + ethLength ? sumsEth[4]?.value : 0;

  const item1 = bscLength ? sumsBsc[3]?.value : 0 + ethLength ? sumsEth[3]?.value : 0;

  const item2 = bscLength ? sumsBsc[2]?.value : 0 + ethLength ? sumsEth[2]?.value : 0;

  const item3 = bscLength ? sumsBsc[1]?.value : 0 + ethLength ? sumsEth[1]?.value : 0;

  const item4 = bscLength ? sumsBsc[0]?.value : 0 + ethLength ? sumsEth[0]?.value : 0;

  const tierFinal = [
    {
      value: item0,
      time: bscLength
        ? sumsBsc[4]?.time
        : ethLength
        ? sumsEth[4]?.time
        : formatDate(new Date().getTime()),
    },
    {
      value: item1,
      time: bscLength
        ? sumsBsc[3]?.time
        : ethLength
        ? sumsEth[3]?.time
        : formatDate(new Date().getTime()),
    },
    {
      value: item2,
      time: bscLength
        ? sumsBsc[2]?.time
        : ethLength
        ? sumsEth[2]?.time
        : formatDate(new Date().getTime()),
    },
    {
      value: item3,
      time: bscLength
        ? sumsBsc[1]?.time
        : ethLength
        ? sumsEth[1]?.time
        : formatDate(new Date().getTime()),
    },
    {
      value: item4,
      time: bscLength
        ? sumsBsc[0]?.time
        : ethLength
        ? sumsEth[0]?.time
        : formatDate(new Date().getTime()),
    },
  ];

  return {
    tier0: tierFinal,
    ethValue: ethLength ? sumsEth[4]?.value : 0,
    bscValue: bscLength ? sumsBsc[4]?.value : 0,
  };
};

export default formatTier;
