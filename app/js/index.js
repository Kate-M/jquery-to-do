import { initElements } from './dom';
import { STATUS } from './constant';
import { taskManager } from './controller';
import {
    createNewTasks
} from './task-logic'

initElements();

export function startEvents() {
    $('#add-task').on('click', createNewTasks);
}

document.addEventListener('DOMContentLoaded', taskManager.init());