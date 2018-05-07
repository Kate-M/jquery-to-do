import { STATUS } from './constant';
import { renderTask } from './view';
import { buttonPosition } from './buttonPosition';
import { utils } from './utils';

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
        this.create = this.create.bind(this);
        this.search = this.search.bind(this);
        this.filter = this.filter.bind(this);
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
        $('#add-task').on('click', this.create);
        $('.search-field').on('input', this.search);
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
        return this.tasksList.filter((el) =>
            el.id == id)[0];
    }

    create(event) {
        event.preventDefault();
        this.clearFilter();
        utils.clearField(errorAddField);
        const taskName = $.trim(addField.val());
        if (!taskName) {
            utils.addError(errorAddField, 'Invalid value');
        } else {
            const taskId = `${new Date().valueOf() }_${taskName}`;
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

    delete(id, container) {
        if (container) {
            container.remove();
        }
        this.tasksList = this.tasksList.filter(i => i.id != id);
        this.sendTaskInLocalDB(this.tasksList);
    }

    edit(form, name) {
        form.find('.edit-name-field').val(name);
        form.addClass('edit-mode');
    }

    cancel(form) {
        form.removeClass('edit-mode');
    }

    save(form, id) {
        const newTaskName = $.trim(form
            .find('.edit-name-field')
            .val());
        const task = taskManager.get(id);
        const labelTask = form
            .find('.name-field');

        if (newTaskName !== '') {
            task.name = newTaskName;
            labelTask.html(newTaskName);
            task.dateEdit = utils.getDate();
            const dateEditArea = form.find('.date-edit');
            const dateEditContent = `last edited ${task.dateEdit}`;

            if (dateEditArea.length === 0) {
                form.find('.date-area').append(`<span class="date-edit">${dateEditContent}</span>`);
            } else {
                dateEditArea.html(dateEditContent);
            }
        }
        form.removeClass('edit-mode');
        this.sendTaskInLocalDB(this.tasksList);
    }

    status(form, id, statusValue) {
        const currentTask = this.get(id);
        if (currentTask.status === statusValue) {
            currentTask.status = STATUS.DEFAULT;
        } else {
            currentTask.status = statusValue;
        }
        this.sendTaskInLocalDB(this.tasksList);
        form.find('.btn-status-complete').attr('checked', currentTask.status === STATUS.COMPLETED);
        form.find('.btn-status').attr('data-status', currentTask.status);
    }

    search(event) {
        event.preventDefault();
        utils.clearField(errorSearchField);
        const serchedTasksList = inFiltered || taskManager.tasksList;
        let searchValue = $.trim(searchField.val().toLowerCase());

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
            utils.addError(errorSearchField, 'Empty field');
            inSearched = null;
        }
    }

    filter(filterParam) {
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
        this.filter(filterMode);
    }

    removeAll(event) {
        event.preventDefault();
        utils.pasteInArea('');
        $.each(this.tasksList, (index, el) => this.delete(el.id));
        this.resetSearch(event);
    }
    removeCompleted(event) {
        event.preventDefault();
        const check = $('.btn-status-complete');
        $.each(check, (index, el) => {
            if ($(el).attr('checked') === 'checked') {
                const removerId = $(el).attr('data-id');
                const removerForm = $(el).parents('form');
                this.delete(removerId, removerForm);
            }
        });
        this.resetSearch(event);
    }
    clearFilter() {
        this.filter();
        finterBtn.html('All');
    }

    sendTaskInLocalDB(tasksList) {
        const serialTasksList = JSON.stringify(tasksList);
        localStorage.setItem('tasksDB', serialTasksList);
    }

}

const taskManager = new TaskManager();

export { taskManager };        
