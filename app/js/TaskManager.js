import { STATUS } from './constant';
import { startEvents } from './index';
import { renderTask } from './view';
import { buttonPosition } from './buttonPosition';
import { utils } from './utils';

let inFiltered;
let filterMode;
let inSearched;
let addField = $('.add-field');
let errorAddField = $('.error-add');
let searchField = $('.search-field');
let errorSearchField = $('.error-search');
let resetSearchButton = $('.reset-search');

class TaskManager {
    constructor() {
        this.tasksList = [];
        this.create = this.create.bind(this);
        this.search = this.search.bind(this);
        this.filter = this.filter.bind(this);
        this.resetSearch = this.resetSearch.bind(this);
        this.switchedTaskControls = this.switchedTaskControls.bind(this);
        this.switchedFilter = this.switchedFilter.bind(this);
    }

    init() {
        this.parseDB();
        this.addEventsListeners();
        buttonPosition();
    }

    parseDB() {
        if (typeof (Storage) !== "undefined") {
            if (localStorage.getItem('tasksDB')) {
                this.tasksList = JSON.parse(localStorage.getItem("tasksDB"));
                $.each(this.tasksList,
                    (index, el) => renderTask(el.id, el.name, el.status, el.date, el.dateEdit)
                );
            }
        } else {
            console.log('Sorry! No Web Storage support');
        }
    }

    addEventsListeners() {
        $('#add-task').on('click', this.create);
        $('.search-field').on('input', this.search);
        $('#reset-search-btn').on('click', this.resetSearch);
        $('#tasks-container').on('click', this.switchedTaskControls);
        $('.menu-btn').on('click', this.openMenuButton);
        $('.filter-btn').on('click', this.openFilterButton);
        $.each($('.filter-item'), (index, el) =>
            $(el).on('click', this.switchedFilter)
        );
    }

    switchedFilter(event) {
        event.preventDefault();
        let activeFilter = $(event.target).html();
        $('.filter-btn').html(activeFilter);
        $('.filter-task').removeClass('open');
        let targetFilter = $(event.target).attr('data-filter');

        switch (targetFilter) {
            case 'filter-all':
                this.filter();
                break;
            case 'filter-in-progress':
                this.filter(STATUS.PROCESSING);
                break;
            case 'filter-complete':
                this.filter(STATUS.COMPLETED);
                break;
            default:
                this.filter();
        }
    }

    switchedTaskControls(event) {
        event.preventDefault();
        let targetElement = $(event.target);
        let targetButton = targetElement.attr('data-state');
        let targetForm = targetElement.parents('form');
        let targetContainer = targetForm.parent();
        let targetTaskId = targetForm
            .find('.name-field')
            .attr('data-id');
        let targetTaskName = targetForm
            .find('.name-field')
            .html();

        switch (targetButton) {
            case 'delete-task':
                this.delete(targetTaskId, targetContainer);
                break;
            case 'edit-task':
                this.edit(targetForm, targetTaskName);
                break;
            case 'cancel-task':
                this.cancel(targetForm);
                break;
            case 'save-task':
                this.save(targetForm, targetTaskId, targetTaskName);
                break;
            case 'status-task':
                this.status(targetForm, targetTaskId, STATUS.PROCESSING);
                break;
            case 'status-complete-task':
                this.status(targetForm, targetTaskId, STATUS.COMPLETED);
                break;
            default:
                break;
        }
    }

    openMenuButton() {
        $('.controls-task-main').toggleClass('open');
    }

    openFilterButton() {
        $('.filter-task').toggleClass('open');
    }

    get(id) {
        return this.tasksList.filter((el, index, array) =>
            el.id == id)[0];
    }

    create(event) {
        event.preventDefault();
        this.clearFilter();
        utils.clearField(errorAddField);
        let taskName = $.trim(addField.val());
        if (!taskName) {
            utils.addError(errorAddField, "Invalid value");
        } else {
            let taskId = new Date().valueOf() + '_' + taskName;
            let taskDate = utils.getDate();
            utils.clearInput(addField);
            renderTask(taskId, taskName, STATUS.DEFAULT, taskDate);
            this.tasksList.push(
                {
                    status: STATUS.DEFAULT,
                    id: taskId,
                    name: taskName,
                    date: taskDate
                }
            );
            this.sendTaskInLocalDB(this.tasksList);
        }
    }

    delete(id, container) {
        container.remove();
        this.tasksList = this.tasksList.filter(i => i.id != id);
        this.sendTaskInLocalDB(this.tasksList);
    }

    edit(form, name) {
        let labelTask = form
            .find('.edit-name-field')
            .val(name);
        form.addClass('edit-mode');
    }

    cancel(form) {
        form.removeClass('edit-mode');
    }

    save(form, id, name) {
        let newTaskName = $.trim(form
            .find('.edit-name-field')
            .val());
        let task = taskManager.get(id);
        let labelTask = form
            .find('.name-field');

        if (newTaskName != '') {
            task.name = newTaskName;
            labelTask.html(newTaskName);
            task.dateEdit = utils.getDate();
            let dateEditArea = form.find('.date-edit');
            let dateEditContent = 'last edited ' + task.dateEdit;

            if (dateEditArea.length == 0) {
                form.find('.date-area').append('<span class="date-edit">' + dateEditContent + '</span>');
            } else {
                dateEditArea.html(dateEditContent)
            }
        }
        form.removeClass('edit-mode');
        this.sendTaskInLocalDB(this.tasksList);
    }

    status(form, id, statusValue) {
        let currentTask = this.get(id);
        if (currentTask.status == statusValue) {
            currentTask.status = STATUS.DEFAULT;
        } else {
            currentTask.status = statusValue;
        }
        this.sendTaskInLocalDB(this.tasksList);
        form.find('.btn-status-complete').attr('checked', currentTask.status == STATUS.COMPLETED);
        form.find('.btn-status').attr('data-status', currentTask.status);
    }

    search(event) {
        event.preventDefault();
        utils.clearField(errorSearchField);
        let serchedTasksList = inFiltered ? inFiltered : taskManager.tasksList;
        var searchValue = $.trim(searchField.val().toLowerCase());

        if (searchValue != '') {
            utils.pasteInArea('');
            resetSearchButton.addClass('open');
            let patt = new RegExp(searchValue, "i");
            let serchedTasks = serchedTasksList.filter((el, index, array) => el.name.search(patt) >= 0);
            $.each(serchedTasks, (index, el) => renderTask(el.id, el.name, el.status, el.date, el.dateEdit));
            inSearched = serchedTasks;
            if (serchedTasks.length == 0) {
                utils.pasteInArea('Nothing');
            }
        }
        else {
            utils.addError(errorSearchField, 'Empty field');
            inSearched = null;
        }
    }

    filter(filterParam) {
        utils.pasteInArea('');
        filterMode = filterParam;
        let filteredTasksList = inSearched ? inSearched : taskManager.tasksList;
        if (!filterParam) {
            $.each(filteredTasksList, (index, el) => renderTask(el.id, el.name, el.status, el.date, el.dateEdit));
            inFiltered = null;
        } else {
            var filteredTasks = filteredTasksList.filter((el, index, array) => el.status == filterParam);
            $.each(filteredTasks, (index, el) => renderTask(el.id, el.name, el.status, el.date, el.dateEdit));
            inFiltered = filteredTasks;
            if (filteredTasks.length == 0) {
                utils.pasteInArea('Nothing')
            }
        }
    }

    resetSearch(event) {
        event.preventDefault();
        resetSearchButton.removeClass('open');
        utils.clearInput(searchField);
        inSearched = null;
        this.filter(filterMode);
    }

    clearFilter() {
        this.filter()
        $('.filter-btn').html('All');
    }

    sendTaskInLocalDB(tasksList) {
        let serialTasksList = JSON.stringify(tasksList);
        localStorage.setItem("tasksDB", serialTasksList);
    }

}

var taskManager = new TaskManager();

export { taskManager };