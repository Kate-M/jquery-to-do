import { taskArea } from './view';

export function getDate() {
    const date = new Date();
    let twoDigitMonth = `${date.getMonth()}`;
    if (twoDigitMonth.length === 1) twoDigitMonth = `0${twoDigitMonth}`;
    let twoDigitDay = `${date.getDate()}`;
    if (twoDigitDay.length === 1) twoDigitDay = `0${twoDigitDay}`;
    const currentDate = `${twoDigitDay}
                            .${twoDigitMonth}
                            .${date.getFullYear()}`;
    return currentDate;
}

export function clearInput(field) {
    field.val('');
}

export function clearField(field) {
    field.html('');
}

export function pasteInArea(message) {
    taskArea.html(message);
}

export function addError(field, message) {
    field.html(message);
}
