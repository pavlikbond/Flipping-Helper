export const addCommas = (num) => {
  return num?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export const isObjectEmpty = (obj) => {
  return Object.keys(obj).length === 0;
};
