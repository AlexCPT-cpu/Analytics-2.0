const timings = () => {
  const currentTimestamp = Date.now();

  const oneHourTimestamp = currentTimestamp - 3600000;

  // const yesterdayTimestamp = currentTimestamp - 86400000;

  // const oneWeekAgoTimestamp = currentTimestamp - 604800000;

  // const oneMonthAgoTimestamp = currentTimestamp - 2592000000;

  // const oneYearAgoTimestamp = currentTimestamp - 31536000000;

  return [
    oneHourTimestamp,
    // yesterdayTimestamp,
    // oneWeekAgoTimestamp,
    // oneMonthAgoTimestamp,
    //  oneYearAgoTimestamp,
  ];
};

export default timings;
