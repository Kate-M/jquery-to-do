import { STATUS, $TASK_AREA } from './constant';
import { taskManager } from './controller';
import { drawTask } from './dom';
import { filterButton } from './index';

let errorAddField = $('.error-add');
let addFied = $('.add-field');

function createNewTasks(evnt) {
    evnt.preventDefault();
    clearField(errorAddField);
    let taskName = $.trim(addFied.val());
    if (!taskName) {
        errorAddField.html("Invalid value");
    } else {
        let taskId = new Date().valueOf() + '_' + taskName;

        var date = new Date();
        var twoDigitMonth = date.getMonth() + '';
        if (twoDigitMonth.length == 1) twoDigitMonth = '0' + twoDigitMonth;
        var twoDigitDay = date.getDate() + '';
        if (twoDigitDay.length == 1) twoDigitDay = '0' + twoDigitDay;
        var taskDate = twoDigitDay + '.' + twoDigitMonth + '.' + date.getFullYear();

        taskManager.add({
            status: STATUS.default,
            id: taskId,
            name: taskName,
            date: taskDate
        });
        addFied.val('');
        drawTask(taskId, taskName, STATUS.default, taskDate);
    }
}

function deleteTask(id, container) {
        container.remove();
        taskManager.delete(id);
};

function clearField(field) {
    field.html('');
}

export {
    createNewTasks,
    deleteTask
};
