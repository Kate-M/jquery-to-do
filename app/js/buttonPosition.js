export function buttonPosition() {
    let windowHeight = $(window).height();
    let heightHeader = $('header').outerHeight();
    let heightFooter = $('footer').outerHeight();

    startPositionButton();
    $('.page').on('click', startPositionButton);

    // $(window).scroll(appearanceButton);

    function startPositionButton() {
        let heightMain = $('main').outerHeight();
        let commonHeight = Math.round(heightMain + heightHeader);
        if (windowHeight >= commonHeight) {
            $('section.controls-task-secondary').removeClass('fixed');
        } else {
            $('section.controls-task-secondary').addClass('fixed');
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