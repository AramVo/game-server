const HOUR = 60 * 60 * 1000;
const FIVE_MINUTES = 5 * 60 * 1000;

function getNextEventDate(isStartDate: boolean) {
  const dateNow = new Date();
  const nextDate = new Date(
    dateNow.getFullYear(),
    dateNow.getMonth(),
    dateNow.getDate(),
    dateNow.getHours(),
  )

  nextDate.setTime(nextDate.getTime() + HOUR + (isStartDate ? 0 : FIVE_MINUTES));

  return nextDate;
}

export default getNextEventDate;