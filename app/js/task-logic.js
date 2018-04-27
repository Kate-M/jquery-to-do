import { STATUS, TASK_AREA } from './constant';
import { taskManager } from './controller';
import { drawTask } from './dom';

let errorField = $('.error');
let addFied = $('.add-field');

function createNewTasks(evnt) {
    evnt.preventDefault();
    clearField(errorField);
    let taskName = $.trim($('.add-field').val());
    if (!taskName) {
        errorField.html = "Invalid value";
    } else {
        let taskId = new Date().valueOf() + '_' + taskName;
        taskManager.add({
            status: STATUS.default,
            id: taskId,
            name: taskName
        });
        $('.add-field').value = '';

        drawTask(taskId, taskName, STATUS.default);
    }
}

function clearField(field) {
    field.html = '';
}

export {
    createNewTasks
};