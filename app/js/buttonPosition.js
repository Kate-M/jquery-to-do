export function buttonPosition() {
    let windowHeight = $(window).height();
    let heightHeader = $('header').outerHeight();
    let heightFooter = $('footer').outerHeight();

    startPositionButton();

    $('.tasks-container').bind("DOMSubtreeModified", startPositionButton);
    $(window).scroll(appearanceButton);

    function startPositionButton() {
        let heightMain = $('main').outerHeight();
        let commonHeight = Math.round(heightMain + heightHeader);
        if (windowHeight >= commonHeight) {
            return $('section.controls-task-secondary').removeClass('fixed');
        }
    };

    function appearanceButton() {
        let scrollHeight = $(document).height() - heightFooter;
        let scrollPosition = Math.round($(window).height() + $(window).scrollTop());
        if (scrollPosition >= scrollHeight) {
            return $('section.controls-task-secondary').removeClass('fixed');
        } else {
            return $('section.controls-task-secondary').addClass('fixed');
        }
    }
}