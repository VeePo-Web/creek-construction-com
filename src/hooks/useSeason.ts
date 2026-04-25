const useSeason = (): "winter" | "spring" | "summer" | "fall" => {
  const month = new Date().getMonth();
  // Winter: November (10), December (11), January (0), February (1), March (2)
  if ([10, 11, 0, 1, 2].includes(month)) return "winter";
  // Spring: March (3), April (4), May (5)
  if ([3, 4, 5].includes(month)) return "spring";
  // Summer: June (6), July (7), August (8)
  if ([6, 7, 8].includes(month)) return "summer";
  // Fall: September (9), October (10)
  return "fall";
};

export default useSeason;
