// ****************************************************************
// コンポーネント関連
// ****************************************************************

// *************************** 初期設定 ***************************
const component = {
    // モーダル
    modal: {
        config: {
            disableScroll: true,
            awaitOpenAnimation: true,
            awaitCloseAnimation: true,
        },
    },
}
// ****************************************************************

$(document).on("load.page", function () {
    // アコーディオン
    $(document).on("click", '.js_acr [aria-controls*="acr_"]', function () {
        var target = "#" + $(this).attr("aria-controls")
        var expanded = $(this).attr("aria-expanded")
        if (expanded === "false") {
            $(this).attr("aria-expanded", true)
            $(target).attr("aria-hidden", false).slideDown()
        } else {
            $(this).attr("aria-expanded", false)
            $(target).attr("aria-hidden", true).slideUp()
        }
    })

    // 商品MVスライダー
    var pdSlider = $(".c_pdmv_slider")
    var pdThumbItem = ".c_pdmv_thumbs_item"
    if (pdSlider.length > 0) {
        $(pdSlider)
            .on("init", function (event, slick) {
                $(this).append(
                    '<div class="slick-counter"><span class="current"></span>/<span class="total"></span></div>'
                )
                $(".current").text(slick.currentSlide + 1)
                $(".total").text(slick.slideCount)
                var index = $(
                    ".c_pdmv_slider_item.slick-slide.slick-current"
                ).attr("data-slick-index")
                $(pdThumbItem + '[data-index="' + index + '"]').addClass(
                    "_current"
                )
            })
            .slick({
                prevArrow:
                    '<button type="button" class="slide-arrow prev-arrow"><img src="/house-cleaning/assets/img/common/btn_arw_prev.svg" alt="前へ"></button>',
                nextArrow:
                    '<button type="button" class="slide-arrow next-arrow"><img src="/house-cleaning/assets/img/common/btn_arw_next.svg" alt="次へ"></button>',
                autoplaySpeed: 5000,
                pauseOnFocus: false,
                pauseOnHover: false,
            })
            .on(
                "beforeChange",
                function (event, slick, currentSlide, nextSlide) {
                    $(this)
                        .find(".current")
                        .text(nextSlide + 1)
                    $(this)
                        .next()
                        .find(".c_pdmv_thumbs_item")
                        .removeClass("_current")
                    $(this)
                        .next()
                        .find(
                            '.c_pdmv_thumbs_item[data-number="' +
                                nextSlide +
                                '"]'
                        )
                        .addClass("_current")
                }
            )

        $(".c_pdmv_thumbs").each(function (i) {
            var $pdThumbItem = $(this).find(".c_pdmv_thumbs_item")
            $pdThumbItem.each(function (index) {
                $(this).attr("data-number", index)
            })
            $pdThumbItem.eq(0).addClass("_current")
            $pdThumbItem.on("click", function () {
                var number = $(this).attr("data-number")
                $(this)
                    .parents(".c_pdmv")
                    .find(".c_pdmv_slider")
                    .slick("slickGoTo", number, true)
                $(this).siblings().removeClass("_current")
                $(this).addClass("_current")
            })
        })
    } else {
        return false
    }

    // モーダル
    MicroModal.init(component.modal.config)

    $(document).on("click", ".modal__container", function (e) {
        // return false;
        e.stopPropagation() //バブリング無効化
    })

    // モーダルリンクの mousedown イベント発火時（クリックより先に呼ばれる）、
    // 画面スクロール位置を保存
    var scroll_pos = -1
    $(document).on("mousedown", "[data-micromodal-trigger]", function () {
        scroll_pos = $(window).scrollTop()
    })

    // モーダルリンクの click イベント
    $(document).on("click", "[data-micromodal-trigger]", function () {
        var attr_name = $(this).attr("data-micromodal-trigger")
        var modal_id = "#" + attr_name

        // 背景のスクロールロック
        $("html").css("overflow", "hidden")
        $("html").css("height", "100vh")

        // body には overflow 付けない
        $("body").css("overflow", "")

        // 強制スクロール
        $(window).scrollTop(scroll_pos)

        $(modal_id).addClass("is-open")
    })

    // モーダルクロール
    $(document).on("click", "[data-micromodal-close]", function () {
        var id = $(this).closest(".modal").attr("id")
        var modal_id = "#" + id

        $(modal_id).removeClass("is-open")
        $("html").css("overflow", "")
        $("html").css("height", "")
        $(window).scrollTop(scroll_pos)
    })

    //モーダル内 リンク
    $(document).on("click", ".c_txt_link", function () {
        window.open($(this).attr("href"), "_blank")
        return false
    })

    // タブ
    $('div[class^="c_tab_box"] .tab_btn').click(function () {
        const $tab_group = $(this).closest('div[class^="c_tab_box"]')
        const $tab_btn = $tab_group.find(".tab_btn")
        const $tab_panel = $tab_group.find(".tab_panel")

        $tab_btn.add($tab_panel).removeClass("active")
        $(this).addClass("active")
        $tab_panel.eq($tab_btn.index(this)).addClass("active")
    })

    // newアイコン等、日付指定で表示切り替え
    const current_date = new Date()
    $("[data-viewdate]").each(function (i) {
        const viewdate = new Date($(this).data("viewdate"))
        if (current_date > viewdate) {
            $(this).hide()
        }
    })
})
