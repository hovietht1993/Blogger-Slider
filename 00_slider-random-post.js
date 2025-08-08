/**
 * Slider Random Post by www.wendycode.com
 * Created on 30-05-2023
 *
 * Deobfuscated by Google's Gemini
 */

// Redirect check removed
// Nếu tên miền hợp lệ, tiếp tục thực thi


    // Kiểm tra xem phần tử chứa slider có tồn tại không
    if (document.getElementById('wendycodeRandomSlider')) {
        var sliderCont = 'wendycodeRandomSlider';

        /**
         * Lấy một số nguyên ngẫu nhiên trong một khoảng
         * @param {number} min - Giá trị nhỏ nhất
         * @param {number} max - Giá trị lớn nhất
         * @returns {number} - Một số nguyên ngẫu nhiên
         */
        function getRandomInt(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        /**
         * Xáo trộn thứ tự các phần tử trong một mảng (thuật toán Fisher-Yates)
         * @param {Array} array - Mảng cần xáo trộn
         * @returns {Array} - Mảng đã được xáo trộn
         */
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

        /**
         * Bắt đầu quá trình lấy dữ liệu bài viết ngẫu nhiên
         * @param {object} json - Dữ liệu JSON từ API Blogger
         */
        function slideRandom(json) {
            // Lấy một chỉ số bắt đầu ngẫu nhiên để đảm bảo bài viết luôn mới mẻ
            var startIndex = getRandomInt(1, json.feed.openSearch$totalResults.$t - wcSliderRandom.amount);

            // Tạo một thẻ script để gọi API Blogger lấy bài viết
            var script = document.createElement('script');
            script.src = wcSliderRandom.url + '/feeds/posts/summary?alt=json-in-script&start-index=' + startIndex + '&max-results=' + wcSliderRandom.amount + '&callback=slideB';
            document.getElementsByTagName('head')[0].appendChild(script);
        }
/**
         * Xử lý dữ liệu JSON và xây dựng HTML cho slider
         * @param {object} json - Dữ liệu JSON từ API Blogger
         */
        function slideB(json) {
            var sliderContainerElement = document.getElementsByClassName(sliderCont)[0];
            var entries = shuffleArray(json.feed.entry); // Xáo trộn các bài viết
            var sliderWrapper = document.createElement('div');
            sliderWrapper.className = 'slide-container';
            var defaultThumbnail = wcSliderRandom.noThumb; // Ảnh đại diện mặc định

            // Lặp qua từng bài viết để tạo slide item
            for (var i = 0; i < entries.length; i++) {
                var post = entries[i];
                var postLink;

                // Tìm link của bài viết
                for (var j = 0; j < post.link.length; j++) {
                    if (post.link[j].rel === 'alternate') {
                        postLink = post.link[j].href;
                        break;
                    }
                }

                var postTitle = post.title.$t;
                var postThumbnail;

                // Lấy ảnh đại diện của bài viết, nếu không có thì dùng ảnh mặc định
                if ('media$thumbnail' in post) {
                    postThumbnail = post.media$thumbnail.url.replace(/.*?:\/\//g, '//').replace(/\/s[0-9]+(\-c)?/, '/s' + wcSliderRandom.thumbSize).replace(/\=s[0-9]+(\-c)?/, '=s' + wcSliderRandom.thumbSize).replace('i.ytimg.com', 'i.ytimg.com');
                } else {
                    postThumbnail = defaultThumbnail;
                }

                var slideItem = document.createElement('div');
                slideItem.className = 'item';
                var innerHTML = '<a href="' + postLink + '" title="' + postTitle + '">';
                innerHTML += '<div class="image" style="background-image: url(\'' + postThumbnail + '\');"></div>';
                innerHTML += '<span class="title">' + postTitle + '</span>';
                innerHTML += '</a>';

                // Thêm thông tin danh mục (category/label) nếu có
                if (post.category && post.category.length > 0) {
                    innerHTML += '<div class="category-info"><a class="category" href="/search/label/' + post.category[0].term + '">' + post.category[0].term + '</a></div>';
                }

                innerHTML += '<div class="play-button-wrapper"></div>';
                slideItem.innerHTML = innerHTML;
                sliderWrapper.appendChild(slideItem);
            }

            // Xóa nội dung cũ và chèn slider mới vào
            sliderContainerElement.innerHTML = '';
            sliderContainerElement.appendChild(sliderWrapper);
            
            // Nếu có nhiều hơn 1 slide thì thêm nút điều hướng và chấm tròn
            if (wcSliderRandom.nav === 'true') {
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
            
            var dotsWrapper = document.createElement('div');
            dotsWrapper.className = 'dots';
            var dotsHTML = '';
            for (var k = 0; k < parseInt(wcSliderRandom.amount); k++) {
                dotsHTML += '<span class="dot"></span>';
            }
            dotsWrapper.innerHTML = dotsHTML;
            sliderContainerElement.appendChild(dotsWrapper);

            // Bắt đầu hiển thị slide
            startSlider();
        }
/**
         * Hàm này được gọi sau khi HTML được xây dựng xong để bắt đầu slider
         */
        function startSlider() {
            var timeOut = wcSliderRandom.speed;
            var slideIndex = 1;
            var slideTimer;

            // Tự động chuyển slide nếu được bật
            if (wcSliderRandom.auto === 'true') {
                var slider = document.querySelector('.wendycodeRandomSlider');

                // Dừng auto slide khi hover
                slider.addEventListener('mouseenter', function() {
                    clearTimeout(slideTimer);
                });
                slider.addEventListener('touchstart', function() {
                    clearTimeout(slideTimer);
                });

                // Chạy lại auto slide khi rời chuột
                slider.addEventListener('mouseleave', function() {
                    autoSlides();
                });
                slider.addEventListener('touchend', function() {
                    autoSlides();
                });

                function autoSlides() {
                    slideTimer = setTimeout(function() {
                        showSlides();
                        autoSlides();
                    }, timeOut);
                }
                autoSlides();
            } else {
                showSlides(); // Hiển thị slide đầu tiên nếu không tự chạy
            }

            // Hiển thị slide trước đó
            window.prevSlide = function() {
                var slides = document.querySelectorAll('.slide-container .item');
                var dots = document.querySelectorAll('.dots .dot');
                for (i = 0; i < slides.length; i++) {
                    slides[i].style.display = 'none';
                    dots[i].className = dots[i].className.replace(' active', '');
                }
                slideIndex--;
                if (slideIndex < 1) {
                    slideIndex = slides.length;
                }
                slides[slideIndex - 1].style.display = 'block';
                dots[slideIndex - 1].className += ' active';
            };

            // Hiển thị slide tiếp theo (hoặc slide đầu tiên)
            window.showSlides = function() {
                var slides = document.querySelectorAll('.slide-container .item');
                var dots = document.querySelectorAll('.dots .dot');
                for (i = 0; i < slides.length; i++) {
                    slides[i].style.display = 'none';
                    dots[i].className = dots[i].className.replace(' active', '');
                }
                slideIndex++;
                if (slideIndex > slides.length) {
                    slideIndex = 1
                }
                slides[slideIndex - 1].style.display = 'block';
                dots[slideIndex - 1].className += ' active';
            };
            
            // Xử lý sự kiện kéo/thả (vuốt) trên di động
            if (wcSliderRandom.drag === 'true') {
                let isDragging = false, startX = 0;
                
                function dragging(e) {
                    e.preventDefault();
                    if (e.touches.length > 0) {
                        const touch = e.touches[0];
                        const moveX = touch.clientX - startX;
                        if (!isDragging) {
                            isDragging = true;
                            if (moveX > 0) prevSlide();
                            else if (moveX < 0) showSlides();
                        }
                    }
                }

                function dragStop() {
                    isDragging = false;
                }
                
                var sliderElement = document.querySelector('.wendycodeRandomSlider');
                sliderElement.addEventListener('touchstart', e => {
                    startX = e.touches[0].clientX;
                });
                sliderElement.addEventListener('touchmove', e => {
                    dragging(e);
                });
                document.addEventListener('touchend', dragStop);
                sliderElement.addEventListener('touchcancel', dragStop);
            }
        }

        // Tạo thẻ script để gọi hàm slideRandom ban đầu
        var script = document.createElement('script');
        script.src = wcSliderRandom.url + '/feeds/posts/summary?alt=json-in-script&max-results=0&callback=slideRandom';
        document.body.appendChild(script);

    } // Kết thúc if (document.getElementById)
                
