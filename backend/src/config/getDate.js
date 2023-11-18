import moment from "moment-timezone";

const getDate = () => {
  const IST = "Asia/Kolkata";
  const currentDate = moment().tz(IST).format("DD-MM-YYYY");
  return currentDate;
};

export const getCurrentDateOfUser = (date) => {
  const IST = "Asia/Kolkata";
  const currentDate = moment(date).tz(IST).format("DD-MM-YYYY");
  return currentDate;
};

export default getDate;
