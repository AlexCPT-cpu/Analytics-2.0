const formatDate = (date) => {
  const today = new Date();
  const isToday =
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();

  if (isToday) {
    // If the date is the same as today, return only the time in 24-hour format
    const options = { hour: "2-digit", minute: "2-digit" };
    return date.toLocaleTimeString(undefined, options);
  } else {
    // For other dates, return the abbreviated date (e.g., "Jul 20")
    const options = { month: "short", day: "numeric" };
    return date.toLocaleDateString(undefined, options);
  }
};

export default formatDate;
