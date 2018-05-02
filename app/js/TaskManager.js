import { startEvents } from './index';
import { renderTask } from './view';
import { buttonPosition } from './buttonPosition';
import { utils } from './Utils';

class TaskManager {
    constructor() {
        this.tasksList = [];
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
        $('#tasks-container').on('click', this.switchedTaskControls);
        $('.menu-btn').on('click', this.openMenuButton);
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
            default:
                console.log('other');
                break;
        }
    }
    openMenuButton() {
        $('.controls-task-main').toggleClass('open');
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

    sendTaskInLocalDB(tasksList) {
        let serialTasksList = JSON.stringify(tasksList);
        localStorage.setItem("tasksDB", serialTasksList);
    }
}

const taskManager = new TaskManager();

export { taskManager };