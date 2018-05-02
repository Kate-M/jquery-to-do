import { STATUS } from './constant';
import { taskManager } from './TaskManager';
import { renderTask } from './view';

let errorAddField = $('.error-add');
let addField = $('.add-field');

class Utils {

    createNewTasks(evnt) {
        evnt.preventDefault();
        clearField(errorAddField);
        console.log(addField);
        let taskName = $.trim(addField.val());
        if (!taskName) {
            errorAddField.html("Invalid value");
        } else {
            let taskId = new Date().valueOf() + '_' + taskName;
            let taskDate = getDate();
            addField.val('');
            renderTask(taskId, taskName, STATUS.DEFAULT, taskDate);
            taskManager.create(taskId, taskName, STATUS.DEFAULT, taskDate);
        }
    }

    deleteTask(id, container) {
        container.remove();
        taskManager.delete(id);
    }

    editTask(form, name) {
        let labelTask = form
            .find('.edit-name-field')
            .val(name);
        taskManager.edit(form, name);
    }

    cancelTask(form) {
        taskManager.cancel(form);
    }

    saveTask(form, id, name) {
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
            let dateEditArea = form.find('.date-edit');
            let dateEditContent = 'last edited ' + task.dateEdit;

            if (dateEditArea.length == 0) {
                form.find('.date-area').append('<span class="date-edit">' + dateEditContent + '</span>');
            } else {
                dateEditArea.html(dateEditContent)
            }
        }
        taskManager.save(form);
    }
};

function getDate() {
    var date = new Date();
    var twoDigitMonth = date.getMonth() + '';
    if (twoDigitMonth.length == 1) twoDigitMonth = '0' + twoDigitMonth;
    var twoDigitDay = date.getDate() + '';
    if (twoDigitDay.length == 1) twoDigitDay = '0' + twoDigitDay;
    var currentDate = twoDigitDay + '.' + twoDigitMonth + '.' + date.getFullYear();
    return currentDate;
}

function clearField(field) {
    field.html('');
}

var utils = new Utils();

export { utils };
