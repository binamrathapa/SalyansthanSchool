export const generateFilterOptions = <T, K extends keyof T>(
  data: T[],
  key: K
) => {
  const uniqueValues = Array.from(new Set(data.map((item) => item[key])));

  return uniqueValues.map((value) => ({
    label: String(value).charAt(0).toUpperCase() + String(value).slice(1),
    value: String(value),
    key: key,
  }));
};
