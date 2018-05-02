import { STATUS, $TASK_AREA } from './constant';

function initElements() {
    

    (function () {
        let windowHeight = $(window).height();
        let heightHeader = $('header').outerHeight();
        let heightFooter = $('footer').outerHeight();

        startPositionButton();

        $(window).change(startPositionButton);
        $(window).scroll(appearanceButton);

        function startPositionButton() {
            let heightMain = $('main').outerHeight();
            let commonHeight = Math.round(heightMain + heightHeader + heightFooter); 
            setButtonPosition(windowHeight, commonHeight);
        };

        function appearanceButton() {
            let scrollHeight = $(document).height() - heightFooter;
            let scrollPosition = Math.round($(window).height() + $(window).scrollTop());
            setButtonPosition(scrollPosition, scrollHeight);
        }

        function setButtonPosition(a, b) {
            if(a >= b){
                $('section.controls-task-secondary').removeClass('fixed');
            } else {
                $('section.controls-task-secondary').addClass('fixed');
            }
        }
    })();

    $('.menu-btn').click(function () {
        $('.controls-task-main').toggleClass('open');
    });
}

function drawTask(id, name, status, date) {
    let newTask = $('<div class="tasks-wrap"></div>');
    let createForm =
        $(`<form action="smth" class="form task-form">
            <fieldset class="field-wrap">
                <div class="task-content">
                    <input type="checkbox" class="btn-status-complete" data-state ="status-complete-task" checked="${status == STATUS.completed}">
                    <p class="field name-field" data-id="${id}">${name}</p>
                    </div>
                <div class="task-info">
                    <p class="date-area" data-date="12.05.2020">${date}</p>
                </div>
                <input type="text" class="field edit-name-field" data-id="${id}" value="${name}">
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
    $TASK_AREA.prepend(newTask);
}

export { initElements, drawTask };