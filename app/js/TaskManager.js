import { STATUS } from './constant';
import { renderTask } from './view';
import { buttonPosition } from './buttonPosition';
import * as utils from './utils';

let inFiltered;
let filterMode;
let inSearched;
const addField = $('.add-field');
const errorAddField = $('.error-add');
const searchField = $('.search-field');
const errorSearchField = $('.error-search');
const resetSearchButton = $('.reset-search');
const finterBtn = $('.filter-btn');

class TaskManager {
    constructor() {
        const instance = TaskManager.instance;
        if (instance) {
            return instance;
        }
        
        TaskManager.instance = this;
        this.tasksList = [];
        this.createTask = this.createTask.bind(this);
        this.searchTask = this.searchTask.bind(this);
        this.filterTask = this.filterTask.bind(this);
        this.resetSearch = this.resetSearch.bind(this);
        this.switchedTaskControls = this.switchedTaskControls.bind(this);
        this.switchedFilter = this.switchedFilter.bind(this);
        this.removeCompleted = this.removeCompleted.bind(this);
        this.removeAll = this.removeAll.bind(this);
    }

    init() {
        this.parseDB();
        this.addEventsListeners();
        buttonPosition();
    }

    parseDB() {
        if (typeof (Storage) !== 'undefined') {
            if (localStorage.getItem('tasksDB')) {
                this.tasksList = JSON.parse(localStorage.getItem('tasksDB'));
                $.each(this.tasksList,
                    (index, el) => renderTask(el.id, el.name, el.status, el.date, el.dateEdit)
                );
            }
        } else {
            console.log('Sorry! No Web Storage support');
        }
    }

    addEventsListeners() {
        $('#add-task').on('click', this.createTask);
        $('.search-field').on('input', this.searchTask);
        $('#reset-search-btn').on('click', this.resetSearch);
        $('#tasks-container').on('click', this.switchedTaskControls);
        $('.menu-btn').on('click', this.openMenuButton);
        $('.filter-btn').on('click', this.openFilterButton);
        $('#btn-remove-completed').on('click', this.removeCompleted);
        $('#btn-remove-all').on('click', this.removeAll);
        $.each($('.filter-item'), (index, el) =>
            $(el).on('click', this.switchedFilter)
        );
    }

    switchedFilter(event) {
        event.preventDefault();
        const activeFilter = $(event.target).html();
        $('.filter-btn').html(activeFilter);
        $('.filter-task').removeClass('open');
        const targetFilter = $(event.target).attr('data-filter');

        switch (targetFilter) {
            case 'filter-all':
                this.filterTask();
                break;
            case 'filter-in-progress':
                this.filterTask(STATUS.PROCESSING);
                break;
            case 'filter-complete':
                this.filterTask(STATUS.COMPLETED);
                break;
            default:
                this.filterTask();
        }
    }

    switchedTaskControls(event) {
        event.preventDefault();
        const targetElement = $(event.target);
        const targetButton = targetElement.attr('data-state');
        const targetForm = targetElement.parents('form');
        const targetContainer = targetForm.parent();
        const targetTaskId = targetForm
            .find('.name-field')
            .attr('data-id');
        const targetTaskName = targetForm
            .find('.name-field')
            .html();

        switch (targetButton) {
            case 'delete-task':
                this.removeTask(targetTaskId, targetContainer);
                break;
            case 'edit-task':
                this.editTask(targetForm, targetTaskName);
                break;
            case 'cancel-task':
                this.cancelTask(targetForm);
                break;
            case 'save-task':
                this.saveTask(targetForm, targetTaskId, targetTaskName);
                break;
            case 'status-task':
                this.statusTask(targetForm, targetTaskId, STATUS.PROCESSING);
                break;
            case 'status-complete-task':
                this.statusTask(targetForm, targetTaskId, STATUS.COMPLETED);
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

    getTask(id) {
        return this.tasksList.filter((el) =>
            el.id === id)[0];
    }

    createTask(event) {
        event.preventDefault();
        this.clearFilter();
        utils.clearField(errorAddField);
        const taskName = $.trim(addField.val());
        if (!taskName) {
            utils.addError(errorAddField, 'Invalid value');
        } else {
            const taskId = `${new Date().valueOf()}_${taskName}`;
            const taskDate = utils.getDate();
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

    removeTask(id, container) {
        if (container) {
            container.remove();
        }
        this.tasksList = this.tasksList.filter(el => el.id !== id);
        this.sendTaskInLocalDB(this.tasksList);
    }

    editTask(form, name) {
        form.find('.edit-name-field').val(name);
        form.addClass('edit-mode');
    }

    cancelTask(form) {
        form.removeClass('edit-mode');
    }

    saveTask(form, id) {
        let newTaskName = $.trim(form
            .find('.edit-name-field')
            .val());
        let task = taskManager.getTask(id);
        
        if (newTaskName !== '') {
            task.name = newTaskName;
            form.find('.name-field').html(newTaskName);
            task.dateEdit = utils.getDate();
            let dateEditArea = form.find('.date-edit');
            let dateEditContent = `last edited ${task.dateEdit}`;

            if (dateEditArea.length === 0) {
                form.find('.date-area').append(`<span class="date-edit">${dateEditContent}</span>`);
            } else {
                dateEditArea.html(dateEditContent);
            }
        }
        form.removeClass('edit-mode');
        this.sendTaskInLocalDB(this.tasksList);
    }

    statusTask(form, id, statusValue) {
        let currentTask = this.getTask(id);
        if (currentTask.status === statusValue) {
            currentTask.status = STATUS.DEFAULT;
        } else {
            currentTask.status = statusValue;
        }
        this.sendTaskInLocalDB(this.tasksList);
        form.find('.btn-status-complete').attr('checked', currentTask.status === STATUS.COMPLETED);
        form.find('.btn-status').attr('data-status', currentTask.status);
    }

    searchTask(event) {
        event.preventDefault();
        utils.clearField(errorSearchField);
        const serchedTasksList = inFiltered || taskManager.tasksList;
        let searchValue = $.trim(searchField.val().toLowerCase());
        console.log(this);
        if (searchValue !== '') {
            utils.pasteInArea('');
            resetSearchButton.addClass('open');
            const patt = new RegExp(searchValue, 'i');
            const serchedTasks = serchedTasksList.filter((el) => el.name.search(patt) >= 0);
            $.each(serchedTasks, (index, el) =>
            renderTask(el.id, el.name, el.status, el.date, el.dateEdit));
            inSearched = serchedTasks;
            if (serchedTasks.length === 0) {
                utils.pasteInArea('Nothing');
            }
        } else {
            this.resetSearch(event);
            inSearched = null;
        }
    }

    filterTask(filterParam) {
        utils.pasteInArea('');
        filterMode = filterParam;
        const filteredTasksList = inSearched || taskManager.tasksList;
        if (!filterParam) {
            $.each(filteredTasksList, (index, el) =>
            renderTask(el.id, el.name, el.status, el.date, el.dateEdit));
            inFiltered = null;
        } else {
            let filteredTasks = filteredTasksList.filter((el) =>
            el.status === filterParam);
            $.each(filteredTasks, (index, el) =>
            renderTask(el.id, el.name, el.status, el.date, el.dateEdit));
            inFiltered = filteredTasks;
            if (filteredTasks.length === 0) {
                utils.pasteInArea('Nothing');
            }
        }
    }

    resetSearch(event) {
        event.preventDefault();
        resetSearchButton.removeClass('open');
        utils.clearInput(searchField);
        inSearched = null;
        this.filterTask(filterMode);
    }

    removeAll(event) {
        event.preventDefault();
        utils.pasteInArea('');
        $.each(this.tasksList, (index, el) => this.removeTask(el.id));
        this.resetSearch(event);
    }
    removeCompleted(event) {
        event.preventDefault();
        const check = $('.btn-status-complete');
        $.each(check, (index, el) => {
            if ($(el).attr('checked') === 'checked') {
                const removerId = $(el).attr('data-id');
                const removerForm = $(el).parents('form');
                this.removeTask(removerId, removerForm);
            }
        });
        this.resetSearch(event);
    }
    clearFilter() {
        this.filterTask();
        finterBtn.html('All');
    }

    sendTaskInLocalDB(tasksList) {
        const serialTasksList = JSON.stringify(tasksList);
        localStorage.setItem('tasksDB', serialTasksList);
    }

}

const taskManager = new TaskManager();

export { taskManager };        
