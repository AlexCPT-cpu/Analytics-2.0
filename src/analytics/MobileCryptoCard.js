import numeral from 'numeral';
import ChevronDownIcon from '@untitled-ui/icons-react/build/esm/ChevronDown';
import ChevronUpIcon from '@untitled-ui/icons-react/build/esm/ChevronUp';
import DotsHorizontalIcon from '@untitled-ui/icons-react/build/esm/DotsHorizontal';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import IconButton from '@mui/material/IconButton';
import SvgIcon from '@mui/material/SvgIcon';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useState, useEffect, useMemo } from 'react';
import { MobileChart13 } from './MobileChart13';

export const MobileCryptoCard = (props) => {
  const { rate, usdValue, sx, buttons, duratia, select, coinAmount, chartArr, loading } = props;

  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (chartArr.length > 0) {
      if (duratia === '1H') {
        setChartData(chartArr);
      } else if (duratia === '1D') {
        setChartData(chartArr);
      } else if (duratia === '1W') {
        setChartData(chartArr);
      } else if (duratia === '1M') {
        setChartData(chartArr);
      } else if (duratia === '1Y') {
        setChartData(chartArr);
      } else {
        setChartData(chartArr);
      }
    }
  }, [duratia, chartArr]);

  const formattedUsdValue = numeral(usdValue).format('$0,0.00');
  const rateIcon = rate < 0 ? <ChevronDownIcon /> : <ChevronUpIcon />;
  const colorItem = rate < 0 ? '#F04438' : '#10b981';
  const colorItem2 = rate < 0 ? 'error' : 'success';
  const multiplier = rate < 0 ? '' : '+';

  const colorIndex = useMemo(() => {
    if (chartData?.length > 0) {
      return chartData[4]?.value >= chartData[3]?.value ? '#10B981' : '#F04438';
    }
  }, [chartData]);

  const chartSeries = useMemo(
    () => [
      {
        name: 'USD',
        data: chartData?.map((data) => data.value.toFixed(2)),
      },
    ],
    [chartData]
  );
  return (
    <div className="mx-auto w-[93vw] md:w-[410px]">
      <Card
        sx={sx}
        className=""
      >
        <CardHeader
          action={
            <IconButton>
              <SvgIcon>
                <DotsHorizontalIcon />
              </SvgIcon>
            </IconButton>
          }
          subheader={
            <div className="flex flex-row space-x-1">
              <SvgIcon
                color={colorItem2}
                fontSize="small"
              >
                {rateIcon}
              </SvgIcon>
              <div className="flex flex-row">
                <Typography
                  color={colorItem}
                  variant="body2"
                  sx={{
                    fontSize: '16px',
                  }}
                >
                  {multiplier}
                  {Number(rate)}%
                </Typography>
                <Typography
                  color={colorItem}
                  variant="body2"
                  sx={{
                    color: colorItem,
                    fontSize: '16px',
                  }}
                >
                  &nbsp; ({`$${Number(coinAmount)}`})
                </Typography>
              </div>
            </div>
          }
          sx={{ pb: 0 }}
          title={
            <Typography
              color="text.secondary"
              sx={{ mb: 1 }}
              variant="h6"
            >
              <Typography
                color="text.primary"
                component="span"
                variant="inherit"
                sx={{
                  fontSize: '30px',
                }}
              >
                {formattedUsdValue}
              </Typography>
            </Typography>
          }
        />
        <div className="">
          {chartData.length > 0 && !loading ? (
            <MobileChart13
              duration={chartData?.map((data) => data.time)}
              chartSeries={chartSeries}
              color={colorIndex}
            />
          ) : (
            <div className="mx-auto absolute md:top-[30%] top-[33%] left-[47%] md:left-[49%]">
              <div role="status">
                <svg
                  aria-hidden="true"
                  className="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentFill"
                  />
                </svg>
                <span className="sr-only">Loading...</span>
              </div>
            </div>
          )}
        </div>

        <div
          className={`flex flex-row items-center justify-center space-x-2 py-2 bottom-0 ${
            loading ? 'mt-40' : ''
          }`}
        >
          {buttons.map((button, index) => (
            <Button
              key={index}
              size="small"
              variant={button.variant}
              onClick={() => select(button)}
              color="primary"
              disabled={loading}
            >
              {button.text}
            </Button>
          ))}
        </div>
      </Card>
    </div>
  );
};
