async function getValueByTimestamp(generatedTimestamp, data) {
  const index = data.findIndex((item) => item.timestamp === generatedTimestamp);
  if (index !== -1) {
    // If the generated timestamp exactly matches a timestamp in the array
    return data[index].price;
  } else {
    // If the generated timestamp falls between two timestamps
    const greaterTimestampIndex = data.findIndex(
      (item) => item.timestamp > generatedTimestamp
    );
    if (greaterTimestampIndex === -1) {
      // If the generated timestamp is after the last data point
      return null;
    } else if (greaterTimestampIndex === 0) {
      // If the generated timestamp is before the first data point
      return data[0].price;
    } else {
      // Return the greater timestamp value
      return data[greaterTimestampIndex - 1].price;
    }
  }
}
export default getValueByTimestamp;
