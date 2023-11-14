import moment from "moment-timezone";

const getCurrentDateAndTime = () => {
  return moment().tz("Asia/Kolkata").format(); // or format according to your needs
};

export default getCurrentDateAndTime;
