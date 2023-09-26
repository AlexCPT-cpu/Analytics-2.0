const times = () => {
  const currentTimestamp = Date.now();

  const diffrence = 2592000000;

  const oneMonthAgoTimestamp = currentTimestamp - diffrence;

  return oneMonthAgoTimestamp;
};

export default times;
