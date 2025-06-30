// ****************************************************************
// スクロール関連
// ****************************************************************

// *************************** 初期設定 ***************************
/*const scroll = {
    // 設定値
    duration: 500, // スクロールのスピード
    easing: "linear", // スクロールのイージング
    position: {
        view_to_top_btn: 100, // 「ページトップへ」ボタンを表示するスクロール値
    },

    $anchor_target: false,
    adjust_height: 0,
    on_resize_do: false, // 画面をリサイズした際に再度スクロールするかどうか
    // スクロールアクション
    toAnchor: function (target = false, adjust_height = false) {
        const main = this
        if (main.$anchor_target === false) target == "#"
        if (target !== false) {
            main.$anchor_target = $(
                target == "#" || target == "" ? "html" : target
            )
        }
        if (adjust_height !== false) {
            main.adjust_height = adjust_height
        }
        main.on_resize_do = "lock"
        const position =
            main.$anchor_target.offset().top -
            responsive.getHeaderHight() -
            main.adjust_height
        $("html, body").animate(
            {
                scrollTop: position,
            },
            main.duration,
            main.easing,
            // 画面リサイズ時の再スクロール準備
            function () {
                main.on_resize_do = true
                // スクロールしたてでスクロールイベントを登録するとすぐに発火してしまうので時間をおいて
                setTimeout(function () {
                    $(window).one("scroll", function () {
                        if (scroll.on_resize_do !== true) return
                        // 画面リサイズ時のスクロールで発火してしまうので時間をおいてフラグ切り替え
                        setTimeout(function () {
                            scroll.on_resize_do = false
                        }, main.duration)
                    })
                }, 100)
            }
        )
    },
    // ヘッダー固定
    fixedHeaderStyle: function(){
        const $gnav = $(".l_gnav")
        const $body = $("body")
        if (!$body.hasClass("is_header_fixed")) {
            // ヘッダー固定していない
            $gnav.removeAttr("style")
            if (responsive.isSp()) {
                $gnav.css("height", "calc(100vh - 104px)")
            }
        } else {
            // ヘッダー固定
            $gnav.removeAttr("style")
            if (responsive.isSp()) {
                $gnav.css("height", "calc(100vh - 50px)")
            }
        }
    },
}*/

const scroll = {
    // 設定値
    duration: 500, // スクロールのスピード
    easing: "linear", // スクロールのイージング
    position: {
        view_to_top_btn: 100, // 「ページトップへ」ボタンを表示するスクロール値
    },

    $anchor_target: false,
    adjust_height: 0,
    on_resize_do: false, // 画面をリサイズした際に再度スクロールするかどうか
    // スクロールアクション
    toAnchor: function (target = false, adjust_height = false) {
        const main = this;
        if (main.$anchor_target === false) target == "#";
        if (target !== false) {
            main.$anchor_target = $(target == "#" || target == "" ? "html" : target);
        }
        // `adjust_height`に50pxを追加
        main.adjust_height = adjust_height !== false ? adjust_height + 50 : 50;

        main.on_resize_do = "lock";
        const position =
            main.$anchor_target.offset().top -
            responsive.getHeaderHight() -
            main.adjust_height;
        $("html, body").animate(
            {
                scrollTop: position,
            },
            main.duration,
            main.easing,
            // 画面リサイズ時の再スクロール準備
            function () {
                main.on_resize_do = true;
                // スクロールしたてでスクロールイベントを登録するとすぐに発火してしまうので時間をおいて
                setTimeout(function () {
                    $(window).one("scroll", function () {
                        if (scroll.on_resize_do !== true) return;
                        // 画面リサイズ時のスクロールで発火してしまうので時間をおいてフラグ切り替え
                        setTimeout(function () {
                            scroll.on_resize_do = false;
                        }, main.duration);
                    });
                }, 100);
            }
        );
    },
    // ヘッダー固定
    fixedHeaderStyle: function () {
        const $gnav = $(".l_gnav");
        const $body = $("body");
        if (!$body.hasClass("is_header_fixed")) {
            // ヘッダー固定していない
            $gnav.removeAttr("style");
            if (responsive.isSp()) {
                $gnav.css("height", "calc(100vh - 104px)");
            }
        } else {
            // ヘッダー固定
            $gnav.removeAttr("style");
            if (responsive.isSp()) {
                $gnav.css("height", "calc(100vh - 50px)");
            }
        }
    },
};

// ****************************************************************

$(document).on("load.page", function () {
    // ページ内リンク
    $(document).on("click", ".js_anchor", function () {
        const href = $(this).attr("href")
        scroll.toAnchor(href, 0)
        return false
    })

    // クレジット登録ページ、作業場所変更ページでのページ内スクロール
    $(document).on("click", ".js_anchorcredit, .js_anchorplace", function () {
        const href = $(this).attr("href")
        let adjust_height = 0
        if ($(".is_hascredit, .is_hasplace").hasClass("checked")) {
            adjust_height = $(
                ".is_hascredit.checked .radioContent, .is_hasplace.checked .radioContent"
            ).innerHeight()
        }
        scroll.toAnchor(href, adjust_height)
        if ($(this).hasClass("newadd")) {
            $("#new").attr("checked", true)
        }
        return false
    })

    // 画面読み込み時にURLにアンカーが存在する場合
    const urlHash = location.hash
    if (urlHash) {
        scroll.toAnchor(urlHash, 0)
    }

    // 画面サイズ切り替え時
    $(document).on("change.breakpoint", function () {
        if (scroll.on_resize_do) scroll.toAnchor()
    })

    // スクロールすると出てくる「ページトップへ」ボタン
    $(document).on("click", ".js_btn_p_top", function () {
        scroll.toAnchor("#", 0)
        return false
    })
    const option = {
        root: null,
        // rootMargin.topに境界を、rootMargin.bottomにbodyの高さを設定
        rooMargin: `${scroll.position.view_to_top_btn}px 0px ${document.body.clientHeight}px 0px`,
        threshold: 1,
    }
    const $to_top_btn = $(".js_btn_p_top")
    const $global_footer = $(".global-footer").get(0)
    const toTopViewObserver = new IntersectionObserver(
        toggleViewToTopBtn,
        option
    )
    const toTopFooterObserver = new IntersectionObserver(toggleFixedToTopBtn)
    toTopViewObserver.observe(document.body)
    toTopFooterObserver.observe($global_footer)
    function toggleViewToTopBtn(entries) {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                // コンテンツがヘッダーに重なったとき
                $to_top_btn.fadeOut()
            } else {
                $to_top_btn.fadeIn()
            }
        })
    }
    function toggleFixedToTopBtn(entries) {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                // footerが見えているとき
                $to_top_btn.css({
                    position: "absolute", //pisitionをabsoluteに変更
                    bottom: "0",
                })
            } else {
                // footerが見えていない時
                $to_top_btn.css({
                    position: "fixed", //固定表示
                    bottom: "24px",
                })
            }
        })
    }
    $to_top_btn.hide()

    // 要素がウィンドウに入ったら実行（現在未使用。使用するには jquery.inview.min.js の読込が必要。）
    $(".js_window_in").on("inview", function (event, isInView) {
        if (isInView) {
            $(this).removeClass("_hide")
            $(this).addClass("_show")
        } else {
            $(this).addClass("_hide")
            $(this).removeClass("_show")
        }
    })
    // 要素がウィンドウに入ったら実行 1回のみ（現在未使用。使用するには jquery.inview.min.js の読込が必要。）
    $(".js_window_in_one").on("inview", function (event, isInView) {
        if (isInView) {
            $(this).addClass("_show")
        }
    })

    // ヘッダー固定
    const $global_header = $(".global-header").get(0)
    const headerObserver = new IntersectionObserver(toggleFixedHeader)
    headerObserver.observe($global_header)
    function toggleFixedHeader(entries) {
        const $gnav = $(".l_gnav")
        const $body = $("body")
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                // グローバルヘッダーがまだ見えているときは固定しない
                $body.removeClass("is_header_fixed")
            } else {
                // ヘッダー固定
                $body.addClass("is_header_fixed")
            }
            scroll.fixedHeaderStyle()
        })
    }
    // 画面サイズ切り替え時
    $(document).on("change.breakpoint", function () {
        scroll.fixedHeaderStyle()
    })

    // 注文確認画面や注文履歴などの右側BOX固定
    const sticky_elements = $(".js_sticky")
    Stickyfill.add(sticky_elements)
})
