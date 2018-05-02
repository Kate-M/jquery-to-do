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
                    (index, el) => drawTask(el.id,el.name, el.status, el.date, el.dateEdit)
                );
            }
        } else {
            console.log('Sorry! No Web Storage support');
        }
        startEvents();
    }
    
    get(id) {
        return this.tasksList.filter((el, index, array) =>
            el.id == id)[0];
    }

    add(item) {
        this.tasksList.push(item);
        sendTaskInLocalDB(this.tasksList); 
    }

    save() {
        sendTaskInLocalDB(this.tasksList);
    }
    
    delete(id) {
        this.tasksList = this.tasksList.filter(i => i.id != id);
        sendTaskInLocalDB(this.tasksList);
    }
}

var taskManager = new TaskManager();

function sendTaskInLocalDB(tasksList) {
    let serialTasksList = JSON.stringify(tasksList);
    localStorage.setItem("tasksDB", serialTasksList);
}

export { sendTaskInLocalDB, taskManager };