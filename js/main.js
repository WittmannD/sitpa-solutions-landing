var map;
function initMap() {
    var donnu = {lat: 49.2242, lng: 28.4265};
    map = new google.maps.Map(document.getElementById('map'), {
        center: donnu,
        zoom: 14,
        disableDefaultUI: true
    });
    var marker = new google.maps.Marker({position: donnu, map: map});
}
/*******************************/
/*******************************/


var i = 0,
    slide = document.getElementById('slide'),
    carousel = document.getElementsByClassName('main__slider')[0],
    item = slide.getElementsByClassName('item'),
    sliderNav = document.getElementById('slider-nav'),
    sticky = document.getElementById('sticky'),
    nav = document.getElementById('nav'),
    runner = document.getElementById('runner'),
    li = nav.getElementsByTagName('li'),
    sections = [],
    offsets = [];

for(i = 0; i < li.length; i++) {
    let h = li[i].children[0].hash.substring(1);
    if(document.getElementById(h)) {
        sections[sections.length] = document.getElementById(h);
        offsets[offsets.length] = document.getElementById(h).offsetTop;
    }
}

function transform(el, e) {
    el.style.left = e.offsetLeft - 1 + 'px';
    el.style.width = e.offsetWidth + 'px';
    return false;
}
/*
function aScrollTo(element, to, duration) {
    var start = element.scrollY,
        change = to - start,
        currentTime = 0,
        increment = 20;

    var animateScroll = function(){
        currentTime += increment;
        var val = Math.easeInOutQuad(currentTime, start, change, duration);
        element.scrollTo(0, val);
        if(currentTime < duration) {
            setTimeout(animateScroll, increment);
        }
    };
    animateScroll();
}

//t = current time
//b = start value
//c = change in value
//d = duration
Math.easeInOutQuad = function (t, b, c, d) {
    t /= d/2;
    if (t < 1) return c/2*t*t + b;
    t--;
    return -c/2 * (t*(t-2) - 1) + b;
};
*/
function goTo(event) {
    event.preventDefault();
    var h = event.currentTarget.hash.substring(1);
    scrollTo(0, document.getElementById(h).offsetTop);
}

function readmore(e) {
    var content = document.querySelector('#company > div.content');
    content.style.height = parseInt(content.style.height) ? 'max-content' : '270px';
    e.textContent = e.textContent === 'Less' ? 'Read more' : 'Less';
}


function slideLeft(count) {
    var w = item[0].offsetWidth,
        val = 0;

    if (count == 'next') {
        val = (slide.style.left != (-slide.offsetWidth + w + 'px')) ? parseInt(slide.style.left) - w : 0;
    } else if (count == 'prev') {
        val = (slide.style.left != '0px') ? parseInt(slide.style.left) + w : -slide.offsetWidth + w;
    } else if (Number(count)){
        val = -count * w;
    }
    slide.style.left = val + 'px';
    var n = parseInt(slide.style.left) / -w;
    Array.from(
        sliderNav.children[0].getElementsByTagName('li')
    ).map(x => x.classList.remove('slide-active'));
    sliderNav.children[0].children[n].classList.add('slide-active')
}

(function main() {
    window.addEventListener("scroll", function(event) {
        if (window.scrollY >= 64) {                                         // Момент прилипания хедера
            sticky.classList.add('sticky');
        } else {
            sticky.classList.remove('sticky');
        }

        for(var i = 0; i < offsets.length; i++) {
            if(window.pageYOffset >= offsets[i] && window.pageYOffset < offsets[i+1]) {
                nav.querySelector('a[href="#' + sections[i].id + '"]').classList.add("active");
                Array.from(
                    nav.querySelectorAll('a:not([href="#' + sections[i].id + '"])')
                ).map(x => x.classList.remove('active'));
                i = offsets.length;
            }
            else if(window.pageYOffset >= offsets[offsets.length - 1]) {
                nav.querySelector('a[href="#' + sections[sections.length - 1].id + '"]').classList.add("active");
                Array.from(
                    nav.querySelectorAll('a:not([href="#' + sections[i].id + '"])')
                ).map(x => x.classList.remove('active'));
            }
        }

        transform(runner, nav.getElementsByClassName('active')[0]);

    });

    for (i = 0; i < li.length; i++) {
        li[i].addEventListener('mouseenter', function () {
            transform(runner, this);
        });
        li[i].children[0].addEventListener('click', goTo);
    }

    if (nav.getElementsByClassName('active').length === 0) {
        document.querySelector('a[href="#home"]').classList.add('active');
    }
    transform(runner, document.getElementsByClassName('active')[0]);

    nav.addEventListener('mouseleave', function () {
        transform(runner, document.getElementsByClassName('active')[0]);
    });

    /*----- Carousel ------*/
    var isPaused = false,
        offWidth = document.body.offsetWidth;

    for (i = 0; i < item.length; i++) {
        item[i].style.width = offWidth + 'px';
        item[i].style.backgroundImage = 'url(' + item[i].dataset.bgurl + ')';
        (function (item, i) {
            let el = document.createElement('li');
            sliderNav.children[0].appendChild(el);
            el.addEventListener('click', function () {
                slideLeft(i)
            });
        })(item, i)
    }
    setInterval(function() {
        if (!isPaused) {
            slideLeft('next');
        }
    }, 6000);

    carousel.addEventListener('mouseenter', function() {
        isPaused = true;
    });
    carousel.addEventListener('mouseleave', function() {
        isPaused = false;
    });
})();
