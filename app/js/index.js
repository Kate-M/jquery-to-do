import { STATUS } from './constant';
import { taskManager } from './controller';
import {
    createNewTasks,
    deleteTask,
    editTask,
    cancelTask
} from './task-logic';
import { initElements } from './dom';

$(document).ready(function () {
    taskManager.init();
    initElements();
});

export function startEvents() {
    $('#add-task').on('click', createNewTasks);
    $('#tasks-container').on('click',
        function (evnt) {
            evnt.preventDefault();
            let targetElement = $(evnt.target);
            let targetButton = targetElement.attr('data-state');
            let targetForm = targetElement.parents('form');
            let targetContainer = targetForm.parent();
            let targetTaskId = targetForm
            .find('.name-field')
            .attr('data-id');
            switch (targetButton) {
                case 'delete-task':
                    deleteTask(targetTaskId, targetContainer);
                    break;
                case 'edit-task':
                    editTask(targetForm);
                    break;
                case 'cancel-task':
                    cancelTask(targetForm);
                    break;        
                default:
                    console.log('other');
                    break;
            }
        }

    );
}

