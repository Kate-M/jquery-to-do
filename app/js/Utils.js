import { STATUS } from './constant';
import { taskManager } from './taskManager';
import { renderTask } from './view';
import { taskArea } from './view';


let errorAddField = $('.error-add');
let errorSearchField = $('.error-search');
let addField = $('.add-field');
let searchField = $('.search-field');
let resetSearchButton = $('.reset-search');

class Utils {

    createNewTasks(evnt) {
        evnt.preventDefault();
        clearFilter();
        clearField(errorAddField);
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

    changeStatus(form, id, statusValue) {
        let status = taskManager.status(form, id, statusValue);
        form.find('.btn-status-complete').attr('checked', status == STATUS.COMPLETED);
        form.find('.btn-status').attr('data-status', status);
    }

    filterTask(filterParam) {
        taskArea.html('');
        let filteredTasks = taskManager.filter(filterParam);
        if (filteredTasks.length == 0) {
            taskArea.html('Nothing');
        }
    }

    searchTask(event) {
        event.preventDefault();
        clearField(errorSearchField);
        var searchValue = $.trim(searchField.val().toLowerCase());

        if(searchValue != '') {
            taskArea.html('');
            resetSearchButton.addClass('open');
            let serchedTasks = taskManager.search(searchValue);
            if (serchedTasks.length == 0) {
                taskArea.html('Nothing');
            }
        }
        else {
            errorSearchField.html('Empty field');
        }
    }

    resetSearchTask(evnt) {
        evnt.preventDefault();
        $('.search-field').value = '';
        resetSearchButton.removeClass('open');
        taskManager.reset();
    }
}

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

function clearFilter() {
    taskManager.clear();
    $('.filter-btn').html('All');
}

var utils = new Utils();

export { utils };
