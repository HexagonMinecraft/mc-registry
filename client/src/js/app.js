$(document).ready(function () {
    $('img').addClass('responsive-img');
    $('.button-collapse').sideNav();
    $('.collapsible').collapsible();
    $('.materialboxed').materialbox();
    $('input#short_description').characterCounter();
    $('select').material_select();
});

function addImgClass() {
    var images = document.getElementsByTagName('img');
    var i;

    for (i = 0; i < images.length; i++) {
        images[i].className += ' materialboxed responsive-img';
    }
}
