/**
 * Slider Random Post
 * Deobfuscated by Google's Gemini
 * * Phiên bản này đã được CẬP NHẬT để tương thích với CSS của Median UI.
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
    // Cập nhật selector để khớp với CSS mới
    var slides = document.querySelectorAll('.slideB .item');
    var dots = document.querySelectorAll('.slideB .i');
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
    // Cập nhật selector để khớp với CSS mới
    var slides = document.querySelectorAll('.slideB .item');
    var dots = document.querySelectorAll('.slideB .i');
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
    // Thay đổi class selector chính
    var sliderContainerElement = document.querySelector('.slideB');
    if (!sliderContainerElement) return;

    var entries = shuffleArray(json.feed.entry);
    // Thay đổi class wrapper thành 'slider'
    var sliderWrapper = document.createElement('div');
    sliderWrapper.className = 'slider'; 
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
            postThumbnail = post.media$thumbnail.url.replace(/\/s[0-9]+(-c)?/, '/s' + wcSliderRandom.thumbSize + '-rw');
        } else {
            postThumbnail = defaultThumbnail;
        }

        var slideItem = document.createElement('a'); // Bọc toàn bộ item trong thẻ 'a'
        slideItem.className = 'item';
        slideItem.href = postLink;
        
        // Thay đổi cấu trúc HTML để khớp với CSS mới
        var innerHTML = '<div class="img" style="background-image: url(\'' + postThumbnail + '\');"></div>';
        innerHTML += '<div class="cap">' + postTitle + '</div>';

        if (post.category && post.category.length > 0) {
            innerHTML += '<div class="category"><a class="button" href="/search/label/' + encodeURIComponent(post.category[0].term) + '">' + post.category[0].term + '</a></div>';
        }
        
        slideItem.innerHTML = innerHTML;
        sliderWrapper.appendChild(slideItem);
    }

    sliderContainerElement.innerHTML = ''; // Xóa nội dung cũ
    sliderContainerElement.appendChild(sliderWrapper);

    // Thêm nút Next/Prev
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

    // Thêm các chấm tròn (dots)
    if (entries.length > 1) {
        // Thay đổi class container của dots thành 'slideI'
        var dotsWrapper = document.createElement('div');
        dotsWrapper.className = 'slideI'; 
        var dotsHTML = '';
        for (var k = 0; k < entries.length; k++) {
            // Thay đổi class của từng dot thành 'i'
            dotsHTML += '<span class="i"></span>'; 
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
    var slider = document.querySelector('.slideB');
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
                    if (Math.abs(moveX) > 50) {
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
if (typeof wcSliderRandom !== 'undefined') {
    var script = document.createElement('script');
    script.src = wcSliderRandom.url + '/feeds/posts/summary?alt=json-in-script&max-results=0&callback=slideRandom';
    document.body.appendChild(script);
}
