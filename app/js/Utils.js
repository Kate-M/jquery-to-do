import { taskArea } from './view';

class Utils {

    getDate() {
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

    clearInput(field) {
        field.val('');
    }

    clearField(field) {
        field.html('');
    }

    pasteInArea(message) {
        taskArea.html(message);
    }

    addError(field, message) {
        field.html(message);
    }
}

const utils = new Utils();

export { utils };
