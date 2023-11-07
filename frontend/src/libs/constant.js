export function sortArray(arr, compareFunction) {
  return arr.slice().sort(compareFunction);
}

export const getDate = () => {
  const date = new Date();
  const currentDate =
    date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear();
  return currentDate;
};

export default getDate;
