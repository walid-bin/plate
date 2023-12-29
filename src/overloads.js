/* this page is to add other mathod or somethig else in the process */
console.log("[+]=> Overlode data added");

/**
 * this function is used to add days with a date.
 * @param {Number} days the mumber of day to add 
 * @returns {Date} a javascript date
 */
Date.prototype.addDays = function (days) {
  let date = new Date(this.toDateString());
  date.setDate(this.getDate() + days);
  date.setUTCHours(0, 0, 0, 0);
  return date;
};