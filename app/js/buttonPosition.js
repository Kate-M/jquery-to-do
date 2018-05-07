export function buttonPosition() {
    const windowHeight = $(window).height();
    const heightHeader = $('header').outerHeight();

    startPositionButton();
    $('.page').on('click', startPositionButton);

    function startPositionButton() {
        const heightMain = $('main').outerHeight();
        const commonHeight = Math.round(heightMain + heightHeader);
        if (windowHeight >= commonHeight) {
            $('section.controls-task-secondary').removeClass('fixed');
        } else {
            $('section.controls-task-secondary').addClass('fixed');
        }
    }
}
