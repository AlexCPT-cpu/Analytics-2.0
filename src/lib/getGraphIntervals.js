const getGraphIntervals = () => {
  var now = new Date();

  var timestamps = [];

  const today = new Date();
  const oneYearAgo = new Date(today);
  let x = oneYearAgo.setFullYear(today.getFullYear() - 1);

  var dates = {
    oneHour: new Date(now.getTime() - 60 * 60 * 1000),
    oneDay: new Date(now.getTime() - 24 * 60 * 60 * 1000),
    sevenDays: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
    oneMonth: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
    oneYear: x,
  };

  const intervals = {
    oneHour: 720,
    oneDay: 17280,
    sevenDays: 120960,
    oneMonth: 518400,
    oneYear: 7884000,
  };
  try {
    Object.keys(dates).forEach(function (key) {
      var date = dates[key];
      var interval = intervals[key];
      var timestamp = now.getTime();
      var timestampArray = [];

      for (var i = 0; i < 5; i++) {
        timestampArray.push(new Date(timestamp).getTime());
        timestamp -= interval * 1000;
      }

      timestamps.push(timestampArray);
    });

    return timestamps;
  } catch (e) {
    console.error(e);
  }
};

export default getGraphIntervals;
