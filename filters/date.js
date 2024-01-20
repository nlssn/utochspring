const { DateTime } = require("luxon");

module.exports = function (dateObj) {
  return DateTime.fromJSDate(dateObj)
    .setLocale("sv")
    .toLocaleString(DateTime.DATE_FULL);
};
