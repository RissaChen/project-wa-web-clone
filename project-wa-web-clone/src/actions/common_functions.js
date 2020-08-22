import fire from '../firebase';
import _ from 'lodash';
import moment from 'moment';

export function raedMessage(useruid, contactid) {
  const updates = {};
  updates[`friendships/${useruid}/${contactid}/isUnraed`] = "None";
  fire.database().ref().update(updates);
}

export function updateStatusInConversation(useruid, contactid, isTyping) { // updates to "Online", "Last seen 01.01.2010" or "Typing"
  const updates = {};
  updates[`friendships/${useruid}/${contactid}/isTyping`] = isTyping;
  fire.database().ref().update(updates);
}

export function updateLastSeen(useruid, lastSeen, callback) { // updates to "Online", "Last seen 01.01.2010" or "Typing"
  const updates = {};
  updates[`users/${useruid}/lastSeen`] = lastSeen;
  fire.database().ref().update(updates).then(() => {
    callback();
  });
}

export function getLastSeenString(isTyping, lastSeen) {
  if (isTyping) {
    return "Typing...";
  }
  if (lastSeen === "Online") {
    return lastSeen;
  }

  const splitted = lastSeen.split(" ");
  let dateString = splitted[0];
  let splittedDate = dateString.split("-");
  let hourString = splitted[1];
  let splittedHour = hourString.split(":");

  const dateObject = new Date(splittedDate[0], splittedDate[1] - 1, splittedDate[2]);
  if (checkIfToday(new Date(), dateObject)) {
    return `Last seen today at ${splittedHour[0]}:${splittedHour[1]}`;
  }
  if (checkIfYesterday(new Date(), dateObject)) {
    return `Last seen yesterday at ${splittedHour[0]}:${splittedHour[1]}`;
  }
  if (checkIfLastWeek(new Date(), dateObject)) {
    const day = getDayFromDayNumber(dateObject.getDay());
    return `Last seen ${day} at ${splittedHour[0]}:${splittedHour[1]}`;
  }

  return `Last seen at ${getCorrectDate(dateString)} ${getCorrectHour(hourString)}`;
}

export function getDateHourString() { 
  return moment().format('YYYY-MM-DD HH:mm');
}

export function sortByUid(array) {
  return array.sort();
}

export function getCharFromNumber(number) {
  const possible = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  return possible.charAt(number);
}

export function makeMessageID() {
  const date = new Date();
  const dateString = `${getCharFromNumber(date.getFullYear() - 2000)}${getCharFromNumber(date.getMonth())}${getCharFromNumber(date.getDate())}`;
  const hourString = `${getCharFromNumber(date.getHours())}${getCharFromNumber(date.getMinutes())}${getCharFromNumber(date.getSeconds())}`;
  return `${dateString}${hourString}`;
}

export function validateEmail(email) {
  return true;
}

export function validatePassword(password) {
  if (password.length < 6) {
    return 'short';
  }
  return true;
}

export function getCorrectDate(time) {
  const dateArray = time.split('-');
  let year = dateArray[0];
  let month = dateArray[1];
  let day = dateArray[2];
  month = month < 10 ? `0${month}` : month;
  day = day < 10 ? `0${day}` : day;
  return `${year}-${month}-${day}`
}

export function getCorrectHour(time) {
  console.log(time)
  const hourArray = time.split(':');
  let hour = hourArray[0];
  let minute = hourArray[1];
  hour = hour < 10 ? `0${hour}` : hour;
  minute = minute < 10 ? `0${minute}` : minute;
  return `${hour}:${minute}`
}

export function filterBySearch(array, subString) {
  return _.filter(array, contact => {
    return contact.info.name.toLowerCase().startsWith(subString.toLowerCase());
  });
}

export function sortContactsByLastMessageTime(array) {
  return array.sort((a, b) => {
    array.map((contact) => {
      if (!contact.lastMessage) { 
        contact.epoch = new Date(2020, 12, 12)
      } else {
        const splitDays = contact.lastMessage.date.split('-');
        const splitHours = contact.lastMessage.hour.split(':');
        const epoch = new Date(splitDays[0], splitDays[1], splitDays[2],
          splitHours[0], splitHours[1], splitHours[2]).getTime() / 1000;
        contact.epoch = epoch;
      }
      return contact;
    });
    return (a.epoch > b.epoch) ? -1 : ((b.epoch > a.epoch) ? 1 : 0);
  });
}

export function splitToPinned(array) {
  const pinned = _.filter(array, (contact) => {
    return contact.pinned;
  });
  const notPinned = _.filter(array, (contact) => {
    return !contact.pinned;
  });
  return [...pinned, ...notPinned];
}

export function getLastMessageTime(lastMessage) {
  if (!lastMessage || lastMessage.date === " " || lastMessage.hour === "0:0:0") {
    return "";
  }
  const splitDate = lastMessage.date.split('-');
  const today = new Date();
  const dateObject = new Date(splitDate[0], splitDate[1] - 1, splitDate[2]);
  if (checkIfToday(today, dateObject))
    return getCorrectHour(lastMessage.hour);

  if (checkIfYesterday(today, dateObject))
    return "Yesterday";

  if (checkIfLastWeek(today, dateObject))
    return getDayFromDayNumber(dateObject.getDay());

  return `${splitDate[1]}-${splitDate[2]}-${splitDate[0]}`; 
}

function checkIfToday(today, dateObject) {
  return moment(today).diff(moment(dateObject), 'days') === 0;
}

function checkIfYesterday(today, dateObject) {
  return moment(today).diff(moment(dateObject), 'days') === 1;
}

function checkIfLastWeek(today, dateObject) {
  return moment(today).diff(moment(dateObject), 'days') < 7;
}

function getDayFromDayNumber(dayNumber) {
  dayNumber = dayNumber > 6 || dayNumber < 0 ? 0 : dayNumber;
  const daysArray = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return daysArray[dayNumber];
}

export function getLastMessage(isTyping, { content }, name) {
  if (isTyping) {
    return "Typing...";
  }
  if (content) {
    const textWidth = (window.innerWidth - 100) / 9;
    return content.length > textWidth ? `${content.substr(0, textWidth)}...` : content;
  }
  return `Start a conversation with ${name}`; 
}

export function getAvatarsNames() {
  const numberOfAvatars = 7;
  const arrayOfAvatarsNames = [];
  arrayOfAvatarsNames.push('default.png');
  for (let i = 1; i <= numberOfAvatars; i++) { 
    arrayOfAvatarsNames.push(`contact${i}.png`);
  }
  return arrayOfAvatarsNames;
}