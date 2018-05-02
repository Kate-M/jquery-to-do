import { STATUS, $TASK_AREA } from './constant';
import { taskManager } from './controller';
import { drawTask } from './dom';
import { filterButton } from './index';

let errorAddField = $('.error-add');
let addField = $('.add-field');

function createNewTasks(evnt) {
    evnt.preventDefault();
    clearField(errorAddField);
    let taskName = $.trim(addField.val());
    if (!taskName) {
        errorAddField.html("Invalid value");
    } else {
        let taskId = new Date().valueOf() + '_' + taskName;
        let taskDate = getDate();
        taskManager.add({
            status: STATUS.default,
            id: taskId,
            name: taskName,
            date: taskDate
        });
        addField.val('');
        drawTask(taskId, taskName, STATUS.default, taskDate);
    }
};

function deleteTask(id, container) {
    container.remove();
    taskManager.delete(id);
};

function editTask(form, name) {
    form.addClass('edit-mode');
    let labelTask = form
        .find('.edit-name-field')
        .val(name);
};

function cancelTask(form) {
    form.removeClass('edit-mode');
};

function saveTask(form, id, name) {
    let newTaskName = $.trim(form
        .find('.edit-name-field')
        .val());
    let task = taskManager.get(id);
    let labelTask = form
        .find('.name-field');

    if (newTaskName != '') {
        task.name = newTaskName;
        labelTask.html(newTaskName);
        task.dateEdit = getDate();
        taskManager.save();
        let dateEditArea = form.find('.date-edit');
        let dateEditContent = 'last edited ' + task.dateEdit;

        if(dateEditArea.length == 0) {
            form.find('.date-area').append('<span class="date-edit">' + dateEditContent + '</span>');
        } else {
            dateEditArea.html(dateEditContent)
        }
    }
    
    form.removeClass('edit-mode');
    
};

function getDate() {
    var date = new Date();
    var twoDigitMonth = date.getMonth() + '';
    if (twoDigitMonth.length == 1) twoDigitMonth = '0' + twoDigitMonth;
    var twoDigitDay = date.getDate() + '';
    if (twoDigitDay.length == 1) twoDigitDay = '0' + twoDigitDay;
    var currentDate = twoDigitDay + '.' + twoDigitMonth + '.' + date.getFullYear();
    return currentDate;
};

function clearField(field) {
    field.html('');
};

export {
    createNewTasks,
    deleteTask,
    editTask,
    cancelTask,
    saveTask
};
