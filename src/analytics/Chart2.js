import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import { useTheme } from '@mui/material/styles';
import { Chart } from 'src/components/chart';

const useChartOptions = (duration, color) => {
  const theme = useTheme();

  return {
    chart: {
      background: 'transparent',
      toolbar: {
        show: false,
      },
    },
    colors: [color ?? theme.palette.error.main, theme.palette.warning.main],
    dataLabels: {
      enabled: false,
    },
    fill: {
      gradient: {
        opacityFrom: 0.5,
        opacityTo: 0,
        stops: [0, 100],
      },
      type: 'gradient',
    },
    grid: {
      borderColor: theme.palette.divider,
      strokeDashArray: 2,
    },
    stroke: {
      width: 2,
    },
    theme: {
      mode: theme.palette.mode,
    },
    xaxis: {
      axisTicks: {
        show: false,
      },
      axisBorder: {
        show: false,
      },
      categories: duration,
      tickAmount: 5,
    },
  };
};

export const Chart13 = ({ chartSeries, duration, color }) => {
  const chartOptions = useChartOptions(duration, color);

  return (
    <Box
      sx={{
        backgroundColor: (theme) => (theme.palette.mode === 'dark' ? 'neutral.800' : 'neutral.100'),
        p: 2,
      }}
    >
      <Card>
        <CardHeader title="Analytics" />
        <CardContent>
          <Chart
            height={250}
            options={chartOptions}
            series={chartSeries}
            type="area"
          />
        </CardContent>
      </Card>
    </Box>
  );
};
