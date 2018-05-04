import { STATUS } from './constant';
export var taskArea = $("#tasks-container");

function renderTask(id, name, status, date, dateEdit) {
    let newTask = $('<div class="tasks-wrap"></div>');
    let createForm =
        $(`<form action="smth" class="form task-form">
            <fieldset class="field-wrap">
                <div class="task-content">
                    <input type="checkbox" class="btn-status-complete" data-state ="status-complete-task" data-id="${id}" ${status == STATUS.COMPLETED ? 'checked="checked"' : '' }>
                    <p class="field name-field" data-id="${id}">${name}</p>
                    </div>
                <input type="text" class="field edit-name-field" data-id="${id}">
                <div class="task-info">
                    <p class="date-area" data-date="12.05.2020">${date}  ${dateEdit ? '<span class="date-edit"> last edited ' + dateEdit + '</span>' : ''}</p>
                </div>
                </fieldset>
            <div class="btn-group">
                <button class="btn btn-sm btn-status" data-state ="status-task" data-status="${status}"></button>
                <button class="btn btn-sm btn-edit" data-state ="edit-task"></button>
                <button class="btn btn-sm btn-delete-item" data-state ="delete-task"></button>
                <button class="btn btn-sm btn-save" data-state="save-task"></button>
                <button class="btn btn-sm btn-cancel" data-state="cancel-task"></button>
            </div>
        </form>`);
    newTask.html(createForm);
    taskArea.prepend(newTask);
}

export { renderTask };