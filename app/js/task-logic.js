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
        taskManager.add({
            status: STATUS.default,
            id: taskId,
            name: taskName
        });
        addFied.val('');
        drawTask(taskId, taskName, STATUS.default);
    }
}

function clearField(field) {
    field.html('');
}

export {
    createNewTasks,
};
