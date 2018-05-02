import { startEvents } from './index';
import { drawTask } from './dom';

class TaskManager {
    constructor() {
        this.tasksList = [];
    }

    init() {
        if (typeof (Storage) !== "undefined") {
            if (localStorage.getItem('tasksDB')) {
                this.tasksList = JSON.parse(localStorage.getItem("tasksDB"));
                $.each(this.tasksList,
                    (index, el) => drawTask(el.id,el.name, el.status, el.date)
                );
            }
        } else {
            console.log('Sorry! No Web Storage support');
        }
        startEvents();
    }

    add(item) {
        this.tasksList.push(item);
        sendTaskInLocalDB(this.tasksList); 
    }

    save() {
        sendTaskInLocalDB(this.tasksList);
    }
}

var taskManager = new TaskManager();

function sendTaskInLocalDB(tasksList) {
    let serialTasksList = JSON.stringify(tasksList);
    localStorage.setItem("tasksDB", serialTasksList);
}

export { sendTaskInLocalDB, taskManager };