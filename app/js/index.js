import { STATUS } from './constant';
import { taskManager } from './controller';
import {
    createNewTasks
} from './task-logic';
import { initElements } from './dom';

$(document).ready(function () {
    taskManager.init();
    initElements();
});

export function startEvents() {
    $('#add-task').on('click', createNewTasks);
}
