import { useMemo } from 'react';
import { AnalyticsConsumer } from 'src/contexts/AnalyticsContext';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';

const EthRow = ({ data }) => {
  const logo = useMemo(() => {
    return data?.chain === 'ethereum' ? '/weth.png' : '/pancake.png';
  }, [data]);

  const { fullData } = AnalyticsConsumer();

  function calculateEthProfit(recentValue, oneDayAgoValue) {
    let priceDifference = 0;
    let percentageChange = 0;
    let zero = 0.01;
    if (oneDayAgoValue === 0) {
      priceDifference = recentValue - zero;
    } else {
      priceDifference = recentValue - oneDayAgoValue;
    }
    const profitLoss = priceDifference > 0 ? 'Profit' : 'Loss';
    if (oneDayAgoValue === 0) {
      percentageChange = (priceDifference / zero) * 100;
    } else {
      percentageChange = (priceDifference / oneDayAgoValue) * 100;
    }

    return {
      profitLoss,
      priceDifference: priceDifference,
      percentageChange,
    };
  }

  const calc = calculateEthProfit(
    data?.amount * fullData?.ethPrices?.eth_PriceNow,
    fullData?.ethBalances?.balances?.balances[0] * fullData?.ethPrices?.eth_Price1H
  );

  return (
    <TableRow hover>
      <TableCell>
        <img
          src={data?.logo}
          className="w-7 lg:w-8 object-cover m-5"
          alt="table-logo"
        />
      </TableCell>
      <TableCell>
        <Stack
          alignItems="center"
          direction="row"
          spacing={1}
        >
          <div>
            <Link
              color="inherit"
              variant="subtitle2"
            >
              {data?.name}
            </Link>
            <Typography
              color="text.secondary"
              variant="body2"
            >
              <span className="flex flex-row items-center">
                <span>
                  <img
                    src={logo}
                    className="w-3 lg:w-3 mr-1 flex"
                    alt="table-logo"
                  />
                </span>
                <span className="capitalize font-light text-xs text-left">{data?.chain}</span>
              </span>
            </Typography>
          </div>
        </Stack>
      </TableCell>
      <TableCell>${Number(data?.price).toLocaleString()}</TableCell>
      <TableCell>
        {Number(data?.amount).toLocaleString()} {data?.symbol}
      </TableCell>
      <TableCell>
        <span className="">${Number(data?.value).toLocaleString()}</span>
        <br />
        <span
          className={`${
            calc.profitLoss === 'Loss' && calc.priceDifference === 0
              ? 'text-green-600'
              : calc.profitLoss === 'Profit'
              ? 'text-green-600'
              : 'text-red-600'
          } flex flex-row whitespace-nowrap`}
        >
          {calc.profitLoss === 'Profit' && '+'}
          {calc.percentageChange.toLocaleString()}% ($
          {calc.priceDifference.toLocaleString()})
        </span>
      </TableCell>
    </TableRow>
  );
};

const BnbRow = ({ data }) => {
  const logo = useMemo(() => {
    return data?.chain === 'ethereum' ? '/weth.png' : '/pancake.png';
  }, [data]);

  const { bscData } = AnalyticsConsumer();

  function calculateEthProfit(recentValue, oneDayAgoValue) {
    let priceDifference = 0;
    let percentageChange = 0;
    let zero = 0.01;
    if (oneDayAgoValue === 0) {
      priceDifference = recentValue - zero;
    } else {
      priceDifference = recentValue - oneDayAgoValue;
    }
    const profitLoss = priceDifference > 0 ? 'Profit' : 'Loss';
    if (oneDayAgoValue === 0) {
      percentageChange = (priceDifference / zero) * 100;
    } else {
      percentageChange = (priceDifference / oneDayAgoValue) * 100;
    }

    return {
      profitLoss,
      priceDifference: priceDifference,
      percentageChange,
    };
  }

  const calc = calculateEthProfit(
    data?.amount * bscData?.bnbData?.bnb_PriceNow,
    bscData?.bscBalances?.balances?.balances[0] * bscData?.bnbData?.bnb_Price1H
  );

  return (
    <TableRow hover>
      <TableCell>
        <img
          src={data?.logo}
          className="w-7 lg:w-8 object-cover m-5"
          alt="table-logo"
        />
      </TableCell>
      <TableCell>
        <Stack
          alignItems="center"
          direction="row"
          spacing={1}
        >
          <div>
            <Link
              color="inherit"
              variant="subtitle2"
            >
              {data?.name}
            </Link>
            <Typography
              color="text.secondary"
              variant="body2"
            >
              <span className="flex flex-row items-center">
                <span>
                  <img
                    src={logo}
                    className="w-3 lg:w-3 mr-1 flex"
                    alt="table-logo"
                  />
                </span>
                <span className="capitalize font-light text-xs text-left">{data?.chain}</span>
              </span>
            </Typography>
          </div>
        </Stack>
      </TableCell>
      <TableCell>${Number(data?.price).toLocaleString()}</TableCell>
      <TableCell>
        {Number(data?.amount).toLocaleString()} {data?.symbol}
      </TableCell>
      <TableCell>
        <span className="">${Number(data?.value).toLocaleString()}</span>
        <br />
        <span
          className={`${
            calc.profitLoss === 'Loss' && calc.priceDifference === 0
              ? 'text-green-600'
              : calc.profitLoss === 'Profit'
              ? 'text-green-600'
              : 'text-red-600'
          } flex flex-row whitespace-nowrap`}
        >
          {calc.profitLoss === 'Profit' && '+'}
          {calc.percentageChange.toLocaleString()}% ($
          {calc.priceDifference.toLocaleString()})
        </span>
      </TableCell>
    </TableRow>
  );
};

const ChainItem = ({ data, chain }) => {
  if (chain === 'ETH') return <EthRow data={data} />;
  else return <BnbRow data={data} />;
};

export default ChainItem;
