import ArrowUpwardRoundedIcon from '@mui/icons-material/ArrowUpwardRounded';
import ArrowDownwardRoundedIcon from '@mui/icons-material/ArrowDownwardRounded';
import CallSplitRoundedIcon from '@mui/icons-material/CallSplitRounded';
import FileCopyRoundedIcon from '@mui/icons-material/FileCopyRounded';

const Type = ({ type }) => {
  if (type === 'sell') {
    return (
      <ArrowUpwardRoundedIcon
        sx={{ fontSize: '35px' }}
        className="rounded-full p-2 bg-gray-200/60 w-9 text-red-600"
      />
    );
  } else if (type === 'buy') {
    return (
      <ArrowDownwardRoundedIcon
        sx={{ fontSize: '35px' }}
        className="rounded-full p-2 bg-gray-200/60 w-9 text-green-600"
      />
    );
  } else if (type === 'transfer') {
    return (
      <ArrowUpwardRoundedIcon
        sx={{ fontSize: '35px' }}
        className="rounded-full p-2 bg-gray-200/60 w-9 text-red-600"
      />
    );
  } else if (type === 'trade') {
    return (
      <CallSplitRoundedIcon
        sx={{ fontSize: '35px' }}
        className="rounded-full p-2 bg-gray-200/60 w-9"
      />
    );
  } else if (type === 'approve') {
    return (
      <FileCopyRoundedIcon
        sx={{ fontSize: '35px' }}
        className="rounded-full p-2 bg-gray-200/60 w-9 text-"
      />
    );
  } else {
    return <div></div>;
  }
};
export default Type;
