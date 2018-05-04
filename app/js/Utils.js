import { STATUS } from './constant';
import { taskManager } from './taskManager';
import { renderTask } from './view';
import { taskArea } from './view';

class Utils {
    
    getDate() {
        var date = new Date();
        var twoDigitMonth = date.getMonth() + '';
        if (twoDigitMonth.length == 1) twoDigitMonth = '0' + twoDigitMonth;
        var twoDigitDay = date.getDate() + '';
        if (twoDigitDay.length == 1) twoDigitDay = '0' + twoDigitDay;
        var currentDate = twoDigitDay + '.' + twoDigitMonth + '.' + date.getFullYear();
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

var utils = new Utils();

export { utils };
