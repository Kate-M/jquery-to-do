import { STATUS } from './constant';
import { startEvents } from './index';
import { renderTask } from './view';
import { buttonPosition } from './buttonPosition';
import { utils } from './utils';

let inFiltered;
let filterMode;
let inSearched;

class TaskManager {
    constructor() {
        this.tasksList = [];
        console.log('taskmanager created');
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
        $('#add-task').on('click', utils.createNewTasks);
        $('.search-field').on('input', utils.searchTask);
        $('#reset-search-btn').on('click', utils.resetSearchTask);
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
                utils.filterTask();
                break;
            case 'filter-in-progress':
                utils.filterTask(STATUS.PROCESSING);
                break;
            case 'filter-complete':
                utils.filterTask(STATUS.COMPLETED);
                break;
            default:
                utils.filterTask();
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
                utils.deleteTask(targetTaskId, targetContainer);
                break;
            case 'edit-task':
                utils.editTask(targetForm, targetTaskName);
                break;
            case 'cancel-task':
                utils.cancelTask(targetForm);
                break;
            case 'save-task':
                utils.saveTask(targetForm, targetTaskId, targetTaskName);
                break;
            case 'status-task':
                utils.changeStatus(targetForm, targetTaskId, STATUS.PROCESSING);
                break;
            case 'status-complete-task':
                utils.changeStatus(targetForm, targetTaskId, STATUS.COMPLETED);
                break;
            default:
                console.log('other');
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

    create(id, name, status, date) {
        this.add({
            status: status,
            id: id,
            name: name,
            date: date
        });
    }

    add(item) {
        this.tasksList.push(item);
        this.sendTaskInLocalDB(this.tasksList);
    }

    edit(form, name) {
        form.addClass('edit-mode');
    }

    cancel(form) {
        form.removeClass('edit-mode');
    }

    save(form) {
        form.removeClass('edit-mode');
        this.sendTaskInLocalDB(this.tasksList);
    }

    delete(id) {
        this.tasksList = this.tasksList.filter(i => i.id != id);
        this.sendTaskInLocalDB(this.tasksList);
    }
    
    status(form, id, statusValue) {
        let currentTask = this.get(id);
        if(currentTask.status == statusValue) {
            currentTask.status = STATUS.DEFAULT;
        } else {
            currentTask.status = statusValue;
        }
        this.sendTaskInLocalDB(this.tasksList);
        return currentTask.status;
    }

    filter(filterParam) {
        filterMode = filterParam;
        let filteredTasksList = inSearched ? inSearched : taskManager.tasksList;
        if (!filterParam) {
            $.each(filteredTasksList, (index, el) => renderTask(el.id, el.name, el.status, el.date, el.dateEdit));
            inFiltered = null;
            return filteredTasksList;
        } else {
            var filteredTasks = filteredTasksList.filter((el, index, array) => el.status == filterParam);
            $.each(filteredTasks, (index, el) => renderTask(el.id, el.name, el.status, el.date, el.dateEdit));
            inFiltered = filteredTasks;
            return filteredTasks;
        }
        
    }

    clear() {
        utils.filterTask();
    }

    search(searchValue) {
        let serchedTasksList = inFiltered ? inFiltered : taskManager.tasksList;

        if (searchValue != '') {
            var patt = new RegExp(searchValue, "i");
            let serchedTasks = serchedTasksList.filter((el, index, array) => el.name.search(patt) >=0);
            $.each(serchedTasks, (index, el) => renderTask(el.id, el.name, el.status, el.date, el.dateEdit));
            inSearched = serchedTasks;
            return serchedTasks;
        } else {
            inSearched = null;
        }
    }
    reset() {
        utils.filterTask(filterMode);
        inSearched = null;
    }

    sendTaskInLocalDB(tasksList) {
        let serialTasksList = JSON.stringify(tasksList);
        localStorage.setItem("tasksDB", serialTasksList);
    }

}

const taskManager = new TaskManager();

export { taskManager };