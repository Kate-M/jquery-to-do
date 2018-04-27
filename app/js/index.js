var he = $('main').height();
// console.log(he)

(function () {
    $(window).scroll(appearanceButton);
    function appearanceButton() {
        var heidthFooter = $('footer').outerHeight();
        var scrollHeight = $(document).height() - heidthFooter;
        var scrollPosition = $(window).height() + $(window).scrollTop();

        if (Math.round(scrollPosition) >= scrollHeight) {
            $('section.controls-task-secondary').removeClass('fixed');
        } else {
            $('section.controls-task-secondary').addClass('fixed');
        }
    }
})();

$('.menu-btn').click(function () {
    $('.controls-task-main').toggleClass('open');
});