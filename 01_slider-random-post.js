/**
 * Slider Random Post by www.wendycode.com
 * Deobfuscated and Corrected by Google's Gemini
 * * Phiên bản này đã được chỉnh sửa để chạy trên mọi tên miền.
 * Đã loại bỏ hoàn toàn yêu cầu 'label' và phần kiểm tra bản quyền.
 */

// ===============================================================
// CÁC HÀM TIỆN ÍCH VÀ CALLBACK
// ===============================================================

var slideIndex = 1;
var slideTimer;

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffleArray(array) {
    var currentIndex = array.length,
        temporaryValue, randomIndex;
    while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

function showSlides() {
    var i;
    var slides = document.querySelectorAll('.wendycodeRandomSlider .item');
    var dots = document.querySelectorAll('.wendycodeRandomSlider .dot');
    if (slides.length === 0) return;

    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
        if (dots.length > i) {
             dots[i].className = dots[i].className.replace(" active", "");
        }
    }
    slideIndex++;
    if (slideIndex > slides.length) {
        slideIndex = 1
    }
    slides[slideIndex - 1].style.display = "block";
    if (dots.length > 0) {
        dots[slideIndex - 1].className += " active";
    }
}

function prevSlide() {
    var i;
    var slides = document.querySelectorAll('.wendycodeRandomSlider .item');
    var dots = document.querySelectorAll('.wendycodeRandomSlider .dot');
    if (slides.length === 0) return;

    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
        if (dots.length > i) {
            dots[i].className = dots[i].className.replace(" active", "");
        }
    }
    slideIndex--;
    if (slideIndex < 1) {
        slideIndex = slides.length
    }
    slides[slideIndex - 1].style.display = "block";
    if (dots.length > 0) {
        dots[slideIndex - 1].className += " active";
    }
}

function slideB(json) {
    var sliderContainerElement = document.querySelector('.wendycodeRandomSlider');
    if (!sliderContainerElement) return;

    var entries = shuffleArray(json.feed.entry);
    var sliderWrapper = document.createElement('div');
    sliderWrapper.className = 'slide-container';
    var defaultThumbnail = wcSliderRandom.noThumb;

    for (var i = 0; i < entries.length; i++) {
        var post = entries[i];
        var postLink = '';

        for (var j = 0; j < post.link.length; j++) {
            if (post.link[j].rel === 'alternate') {
                postLink = post.link[j].href;
                break;
            }
        }

        var postTitle = post.title.$t;
        var postThumbnail;

        if ('media$thumbnail' in post && post.media$thumbnail.url) {
            postThumbnail = post.media$thumbnail.url.replace(/\/s[0-9]+(-c)?/, '/s' + wcSliderRandom.thumbSize);
        } else {
            postThumbnail = defaultThumbnail;
        }

        var slideItem = document.createElement('div');
        slideItem.className = 'item';
        
        var innerHTML = '<a href="' + postLink + '" title="' + postTitle + '">';
        innerHTML += '<div class="image" style="background-image: url(\'' + postThumbnail + '\');"></div>';
        innerHTML += '<span class="title">' + postTitle + '</span>';
        innerHTML += '</a>';

        if (post.category && post.category.length > 0) {
            innerHTML += '<div class="category-info"><a class="category" href="/search/label/' + encodeURIComponent(post.category[0].term) + '">' + post.category[0].term + '</a></div>';
        }
        
        slideItem.innerHTML = innerHTML;
        sliderWrapper.appendChild(slideItem);
    }

    sliderContainerElement.innerHTML = '';
    sliderContainerElement.appendChild(sliderWrapper);

    if (wcSliderRandom.nav === 'true' && entries.length > 1) {
        var prevButton = document.createElement('button');
        prevButton.innerHTML = '‹';
        prevButton.className = 'prev';
        prevButton.onclick = prevSlide;
        sliderContainerElement.appendChild(prevButton);

        var nextButton = document.createElement('button');
        nextButton.innerHTML = '›';
        nextButton.className = 'next';
        nextButton.onclick = showSlides;
        sliderContainerElement.appendChild(nextButton);
    }

    if (entries.length > 1) {
        var dotsWrapper = document.createElement('div');
        dotsWrapper.className = 'dots';
        var dotsHTML = '';
        for (var k = 0; k < entries.length; k++) {
            dotsHTML += '<span class="dot"></span>';
        }
        dotsWrapper.innerHTML = dotsHTML;
        sliderContainerElement.appendChild(dotsWrapper);
    }
    
    startSlider();
}

function slideRandom(json) {
    var totalResults = parseInt(json.feed.openSearch$totalResults.$t);
    if (totalResults === 0) return;
    
    var amount = parseInt(wcSliderRandom.amount);
    var maxStartIndex = totalResults - amount;
    var startIndex = (maxStartIndex > 0) ? getRandomInt(1, maxStartIndex) : 1;

    var script = document.createElement('script');
    script.src = wcSliderRandom.url + '/feeds/posts/summary?alt=json-in-script&start-index=' + startIndex + '&max-results=' + amount + '&callback=slideB';
    document.getElementsByTagName('head')[0].appendChild(script);
}

function startSlider() {
    var timeOut = wcSliderRandom.speed;
    var slider = document.querySelector('.wendycodeRandomSlider');
    if (!slider) return;

    if (wcSliderRandom.auto === 'true') {
        function autoSlides() {
            clearTimeout(slideTimer);
            slideTimer = setTimeout(function() {
                showSlides();
                autoSlides();
            }, timeOut);
        }

        slider.addEventListener('mouseenter', function() { clearTimeout(slideTimer); });
        slider.addEventListener('touchstart', function() { clearTimeout(slideTimer); });
        slider.addEventListener('mouseleave', autoSlides);
        slider.addEventListener('touchend', autoSlides);
        
        autoSlides();
    }
    
    showSlides();

    if (wcSliderRandom.drag === 'true') {
        let isDragging = false, startX = 0;

        function dragging(e) {
            e.preventDefault();
            if (e.touches.length > 0) {
                const touch = e.touches[0];
                const moveX = touch.clientX - startX;
                if (!isDragging) {
                    if (Math.abs(moveX) > 50) { // Chỉ vuốt khi di chuyển đủ xa
                       isDragging = true;
                       if (moveX > 0) prevSlide();
                       else showSlides();
                    }
                }
            }
        }

        function dragStop() {
            setTimeout(function() { isDragging = false; }, 100);
        }

        slider.addEventListener('touchstart', e => { startX = e.touches[0].clientX; });
        slider.addEventListener('touchmove', dragging);
        slider.addEventListener('touchend', dragStop);
        slider.addEventListener('touchcancel', dragStop);
    }
}

// ===============================================================
// ĐIỂM BẮT ĐẦU THỰC THI
// ===============================================================

// Chỉ thực thi khi có đối tượng cấu hình và không kiểm tra tên miền nữa
if (typeof wcSliderRandom !== 'undefined') {
    var script = document.createElement('script');
    script.src = wcSliderRandom.url + '/feeds/posts/summary?alt=json-in-script&max-results=0&callback=slideRandom';
    document.body.appendChild(script);
}
