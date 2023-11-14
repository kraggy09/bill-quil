export function sortArray(arr, compareFunction) {
  return arr.slice().sort(compareFunction);
}

export const getDate = () => {
  const date = new Date();
  const currentDate =
    date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear();
  return currentDate;
};

export const calculateDate = (date) => {
  let str =
    date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear();
  return str;
};
export const calculateTime = (date) => {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  const str =
    (hours > 9 ? hours : "0" + hours) +
    ":" +
    (minutes > 9 ? minutes : "0" + minutes) +
    ":" +
    (seconds > 9 ? seconds : "0" + seconds);
  return str;
};

export default getDate;
