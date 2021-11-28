(function ($) {
    let loadLazyLoadScript = false;
    let screenRes_ = {
        isDesktop: true,
        isTablet: false,
        isMobile: false,
        isMd: false,
        isXl: false,
    };

    $(document).ready(function () {
        checkScreenSize();
        imgToBg();
        openMenu();
        initMenu();
        closeMenu();
        lazyLoad();
        scrollToSections();
        initPlacesSlider();
        renderCard(placeCards);
        filterPlaceCard();
        toggleHeaderSearch();
        autoTypeTextPlay();
    }); // ready

    $(window).on("resize", function () {
        checkScreenSize();
        autoCloseMenu();
    }); // resize
    $(window).on("scroll", function () {
        fixedHeader();
    }); // scroll

    $(window).on("load", function () {}); // load

    if (window.NodeList && !NodeList.prototype.forEach) {
        NodeList.prototype.forEach = Array.prototype.forEach;
    } //polyfill

    function checkScreenSize() {
        let winWidth = $(window).outerWidth();
        screenRes_.isMd = winWidth > 992;
        screenRes_.isXl = winWidth > 1439;
        screenRes_.isDesktop = winWidth > 1024;
        screenRes_.isMobile = winWidth < 768;
        screenRes_.isTablet = !screenRes_.isMobile && winWidth < 992;
    }

    function imgToBg() {
        $(".bg-img").each(function () {
            let $img = $(this).find("> img");

            if ($img.length) {
                $(this).css("background-image", "url(" + $img.attr("src") + ")");
                $img.hide();
            }
        });
    }
    function lazyLoad() {
        if ("loading" in HTMLImageElement.prototype) {
            let images = document.querySelectorAll("img.lazyload");
            images.forEach(function (img) {
                img.src = img.dataset.src;
                img.classList.add("lazyloaded");
                if (img.classList.contains("svg-html")) {
                    replaseInlineSvg($(img));
                }
                if (img.classList.contains("lazyload-bg")) {
                    img.style.display = "none";
                    img.parentNode.style.backgroundImage = "url(" + img.dataset.src + ")";
                }
            });
        } else {
            if (!loadLazyLoadScript) {
                loadLazyLoadScript = true;
                let script = document.createElement("script");
                script.async = true;
                script.src = "https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.2.0/lazysizes.min.js";
                document.body.appendChild(script);
            }
            document.addEventListener("lazyloaded", function (e) {
                let img = e.target;
                if (img.classList.contains("lazyload-bg")) {
                    img.style.display = "none";
                    img.parentNode.style.backgroundImage = "url(" + img.dataset.src + ")";
                }
                if (img.classList.contains("svg-html")) {
                    replaseInlineSvg($(img));
                }
            });
        }
    }

    function replaseInlineSvg(elem) {
        elem.each(function () {
            let $img = $(this);
            let imgID = $img.attr("id");
            let imgClass = $img.attr("class");
            let imgURL = $img.attr("src");

            $.get(
                imgURL,
                function (data) {
                    let $svg = $(data).find("svg");
                    if (typeof imgID !== "undefined") {
                        $svg = $svg.attr("id", imgID);
                    }
                    if (typeof imgClass !== "undefined") {
                        $svg = $svg.attr("class", imgClass + " replaced-svg");
                    }
                    $svg = $svg.removeAttr("xmlns:a");
                    $img.replaceWith($svg);
                },
                "xml"
            );
        });
    }

    function initMenu() {
        let $menu = $(".header-menu");
        $(".open-menu").click(function (event) {
            event.preventDefault();
            $("html, body").toggleClass("menu-opened");
        });

        $menu.find("li").has("ul").addClass("has-drop");
        $(".has-drop > a")
            .click(function (event) {
                if ($(window).width() < 768) {
                    if (!$(this).parent().hasClass("opened")) {
                        event.preventDefault();
                        $(this).parent().addClass("opened");
                        $(this).parent().siblings(".opened").removeClass("opened");
                    } else {
                        $(this).parent().removeClass("opened");
                    }
                }
            })
            .on("touchend", function (event) {
                if ($(window).width() > 767) {
                    if (!$(this).parent().hasClass("hover")) {
                        event.preventDefault();
                        $(this).parent().addClass("hover");
                        $(this).parent().siblings(".hover").removeClass("hover");
                    } else {
                        $(this).parent().removeClass("hover");
                    }
                }
            });
        $(document).on("mouseup touchend ", function (e) {
            let container = $(".header-menu .hover");
            if (!container.is(e.target) && container.has(e.target).length === 0) {
                container.removeClass("hover");
            }
        });
    }

    function openMenu() {
        $(".open-menu").on("click", function (e) {
            e.preventDefault();
            $(this).toggleClass("menu-opened");
            $(".header-menu").toggleClass("menu-opened");
            $("body").toggleClass("menu-opened");
        });
    }

    function fixedHeader() {
        let header = $(".header");
        if (header) {
            if (window.pageYOffset > 1 && !$(header).hasClass("fixed")) {
                $(header).addClass("fixed");
            } else if (window.pageYOffset < 1 && $(header).hasClass("fixed")) {
                $(header).removeClass("fixed");
            }
        }
    }

    function closeMenu() {
        $(".header-menu li a").on("click", function (e) {
            e.preventDefault();
            $("html").removeClass("menu-opened");
            $("body").removeClass("menu-opened");
            $(".header-menu").removeClass("menu-opened");
            $(".open-menu").removeClass("menu-opened");
            $(".black-mask").removeClass("menu-opened");
        });
        $(document).on("click", function (e) {
            let menu = $("#header");
            if (!menu.is(e.target) && menu.has(e.target).length === 0 && $(".header-menu").hasClass("menu-opened")) {
                $("html").removeClass("menu-opened");
                $("body").removeClass("menu-opened");
                $(".header-menu").removeClass("menu-opened");
                $(".open-menu").removeClass("menu-opened");
                $(".black-mask").removeClass("menu-opened");
            }
        });
    }
    function autoCloseMenu() {
        if (window.innerWidth > 991) {
            $("html").removeClass("menu-opened");
            $("body").removeClass("menu-opened");
            $(".header-menu").removeClass("menu-opened");
            $(".open-menu").removeClass("menu-opened");
            $(".black-mask").removeClass("menu-opened");
        }
    }

    function scrollToSections() {
        let headerButtons = document.querySelectorAll(".header-menu li a");
        headerButtons.forEach(function (item) {
            $(item).on("click", function (e) {
                $(".header-menu li a").not(this).removeClass("active");
                $(this).toggleClass("active");
                e.preventDefault();
                let href = e.target.href;
                let hrefHash = href.indexOf("#", 0);
                let sectionName = href.slice(hrefHash);
                let section = $(sectionName);
                let sectionOffset = section.offset().top;
                let headerOuterHeight = $("#header").outerHeight();
                $(".header-menu, .dropdown-btn").removeClass("active");
                $(".flex-home").removeClass("menu-opened");
                window.scrollTo({
                    top: sectionOffset - headerOuterHeight,
                    behavior: "smooth",
                });
            });
        });
    }

    function initPlacesSlider() {
        $(".places-slider").slick({
            arrows: false,
            slidesToShow: 5,
            slidesToScroll: 1,
            dots: false,
            centerMode: true,
            centerPadding: 0,
            adaptiveHeight: true,
            autoplay: true,
            autoplaySpeed: 2000,
            speed: 700,
            customPaging: function (slider, i) {
                return "<span></span>";
            },
            responsive: [
                {
                    breakpoint: 1440,
                    settings: {
                        slidesToShow: 3,
                        slidesToScroll: 1,
                    },
                },
                {
                    breakpoint: 767,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1,
                    },
                },
            ],
        });
        $(".places-slider").on("beforeChange ", function (event, slick, direction) {
            $(".slide").addClass("hidden");
            setTimeout(function () {
                $(".slide").removeClass("visible").removeClass("current");
            }, 400);
        });
        $(".places-slider").on("afterChange init", function (event, slick, direction) {
            // console.log('afterChange/init', event, slick, slick.$slides);
            // remove all prev/next
            // find current slide
            for (let i = 0; i < slick.$slides.length; i++) {
                let $slide = $(slick.$slides[i]);
                if ($slide.hasClass("slick-current")) {
                    // update DOM siblings
                    $(".slide").removeClass("hidden");
                    $slide.addClass("current");
                    $slide.prev().addClass("visible");
                    $slide.next().addClass("visible");
                    break;
                }
            }
        });
    }


    let placeCards = [
        { img: "images/img-cards-01.jpg", title: "Poznan", location: "Wielkopolskie", btnValue: "View Offers" },
        { img: "images/img-cards-02.jpg", title: "Warsaw", location: "Mazowieckie", btnValue: "View Offers" },
        { img: "images/img-cards-03.jpg", title: "Wroclaw", location: "Dolnoslaskie", btnValue: "View Offers" },
        { img: "images/img-cards-04.jpg", title: "Karpacz", location: "Dolnoslaskie", btnValue: "View Offers" },
        { img: "images/img-cards-05.jpg", title: "Dolina Olczyska", location: "Malopolskie", btnValue: "View Offers" },
        { img: "images/img-cards-06.jpg", title: "Kozy", location: "Slaskie", btnValue: "View Offers" },
    ];

    function renderCard(cards) {
        let cardsRow = document.querySelector(".search-place .row");
        cardsRow.innerHTML = ""
        cards.map(function (card) {
            let cardElement = createPlaceCard(card.img, card.title, card.location, card.btnValue)
            cardsRow.append(cardElement)
        });
    }
    function createPlaceCard(imgSrc, title, location, btnValue) {
        let card = document.createElement("div");
        card.classList.add("col-md-4");
        card.innerHTML = `
            <div class="place-card">
                <img src=${imgSrc} alt="#">
                <h5>${title}</h5>
                <p>${location}</p>
                <div class="btn btn-white">${btnValue}</div>
            </div>  
        `;

        return card
    }
    function filterPlaceCard (){
        let filterInput = document.querySelector('.search-place-header input');
        let filterBtn = document.querySelector('.search-place-btn');

        filterInput.addEventListener('input', function(e){
            let value = e.currentTarget.value.trim().toLowerCase();
            let newCardsRow = placeCards.filter(card => card.title.toLowerCase().includes(value) || card.location.toLowerCase().includes(value))
            renderCard(newCardsRow)
        })
    }
    
    function toggleHeaderSearch(){
        $('.header .search-btn').on('click', function(e){
            e.preventDefault();
            $(this).parent().toggleClass('active');
        })
    }
function autoType(elementClass, typingSpeed){
  var thhis = $(elementClass);
  thhis.css({
    "position": "relative",
    "display": "inline-block"
  });
  thhis.prepend('<div class="cursor" style="right: initial; left:0;"></div>');
  thhis = thhis.find(".text-js");
  var text = thhis.text().trim().split('');
  var amntOfChars = text.length;
  var newString = "";
  thhis.text("|");
  setTimeout(function(){
    thhis.css("opacity",1);
    thhis.prev().removeAttr("style");
    thhis.text("");
    for(var i = 0; i < amntOfChars; i++){
      (function(i,char){
        setTimeout(function() {        
          newString += char;
          thhis.text(newString);
        },i*typingSpeed);
      })(i+1,text[i]);
    }
  },1000);
  setTimeout(function(){
     thhis.prev().remove();
  }, 2500)
}

function autoTypeTextPlay(){
   let firstText = new Promise((resolve,reject) =>{
         autoType(".type-js", 130);
       setTimeout(()=>{
           resolve(); 
        },1800)
   } )
   firstText.then(() => {
    autoType(".type-js-2", 130);
   })
    
}

})(jQuery);
