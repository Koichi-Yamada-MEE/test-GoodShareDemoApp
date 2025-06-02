// ****************************************************************
// インターフェース関連
// ****************************************************************

// *************************** 初期設定 ***************************
const ui = {
    // ハンバーガーメニュー
    hamburger: {
        $toggle_btn: false,
        $toggle_txt: false,
        $gnav: false,
        setupElements: function () {
            this.$toggle_btn = $(".l_hamburger")
            this.$toggle_txt = $(".l_hamburger_txt")
            this.$gnav = $("#gnav")
        },
        close: function () {
            this.setupElements()
            this.$toggle_btn.attr("aria-expanded", false)
            this.$toggle_txt.text("メニューを開く")
            if (this.$gnav.attr("aria-hidden") == "true") return // モーダルが開いていなければ終了
            MicroModal.close("gnav", {
                awaitCloseAnimation: true,
            })
        },
        open: function () {
            this.setupElements()
            this.$toggle_btn.attr("aria-expanded", true)
            this.$toggle_txt.text("メニューを閉じる")
            MicroModal.show("gnav", {
                // disableScroll: true,
                awaitOpenAnimation: true,
            })
        },
    },
    // 検索窓開閉
    search: {
        $btn: false,
        target: false,
        $box: false,
        setupElements: function () {
            this.$btn = $(".js_toggleSearchBtn")
            this.target = this.$btn.attr("aria-controls")
            this.$box = $("#" + this.target)
        },
        close: function () {
            this.setupElements()
            this.$box.fadeOut().attr("aria-hidden", "true")
            this.$btn.attr("aria-expanded", "false")
        },
        open: function () {
            this.setupElements()
            this.$box.fadeIn().attr("aria-hidden", "false")
            this.$btn.attr("aria-expanded", "true")
        },
    },
    // サブメニュー開閉（PC）
    subMenuPc: {
        $toggle_btn: false,
        $toggle_btn_all: false,
        toggle_target: false,
        $toggle_content: false,
        $toggle_content_all: false,
        $toggle_overlay: false,
        closeAll: function () {
            const $toggle_btn_all = $(
                ".js_toggleSubMenuPc1, .js_toggleSubMenuPc2, .js_toggleSubMenuPc3, .js_toggleSubMenuPc4"
            )
            $toggle_btn_all.attr("aria-expanded", "false")
            $toggle_btn_all.each(function () {
                const toggle_target_all = $(this).attr("aria-controls")
                const $toggle_content_all = $("#" + toggle_target_all)
                $toggle_content_all.fadeOut().attr("aria-hidden", "true")
            })
            this.$toggle_overlay = $(".l_gnavSubListPc_overlay")
        },
        close: function () {
            this.closeAll()
            this.$toggle_overlay.fadeOut()
        },
        open: function (element) {
            this.closeAll() // 一旦すべて閉じる
            this.$toggle_btn = $(element)
            this.toggle_target = this.$toggle_btn.attr("aria-controls")
            this.$toggle_content = $("#" + this.toggle_target)
            this.$toggle_btn.attr("aria-expanded", "true")
            this.$toggle_content.fadeIn().attr("aria-hidden", "false")
            this.$toggle_overlay.fadeIn()
        },
    },
}
// ****************************************************************

$(document).on("load.page", function () {
    // img ドラッグ・右クリック禁止
    $("img")
        .attr("onmousedown", "return false")
        .attr("onselectstart", "return false")
        .attr("oncontextmenu", "return false")

    // ハンバーガーメニュー
    $(document).on("click", ".l_hamburger", function () {
        const expanded = $(this).attr("aria-expanded")
        if (expanded == "false") {
            ui.hamburger.open()
        } else {
            ui.hamburger.close()
        }
    })
    $(document).on("click", ".l_gnavList_close", function () {
        ui.hamburger.close()
    })
    $(document).on("change.breakpoint", function () {
        if (responsive.isPc()) {
            $("#gnav").removeAttr("aria-hidden").removeClass("is-open")
        } else {
            $("#gnav").attr("aria-hidden", true)
            ui.hamburger.close()
        }
    })

    // 検索窓開閉
    $(document).on("click", ".js_toggleSearchBtn", function () {
        const expanded = $(this).attr("aria-expanded")
        if (expanded == "false") {
            ui.search.open()
        } else {
            ui.search.close()
        }
    })
    $(document).on("click", ".l_search_overlay", function () {
        ui.search.close()
    })

    //サブメニュー開閉（SP）
    $(document).on(
        "click",
        ".js_toggleSubMenuSp1, .js_toggleSubMenuSp2, .js_toggleSubMenuSp3, .js_toggleSubMenuSp4, .js_toggleSubMenuSp5, .js_toggleSubMenuSp6, .js_toggleSubMenuSp7",
        function () {
            const expanded = $(this).attr("aria-expanded")
            const toggleSubMenuTarget = $(this).attr("aria-controls")
            const $toggleSubMenu = $("#" + toggleSubMenuTarget)
            if (expanded == "false") {
                $(this).attr("aria-expanded", "true")
                $toggleSubMenu.slideDown().attr("aria-hidden", "false")
            } else {
                $(this).attr("aria-expanded", "false")
                $toggleSubMenu.slideUp().attr("aria-hidden", "true")
            }
        }
    )

    // サブメニュー開閉（PC）
    //メニューボタンで開閉
    $(document).on(
        "click",
        ".js_toggleSubMenuPc1, .js_toggleSubMenuPc2, .js_toggleSubMenuPc3, .js_toggleSubMenuPc4",
        function () {
            const expanded = $(this).attr("aria-expanded")
            if (expanded == "false") {
                ui.subMenuPc.open(this)
            } else {
                ui.subMenuPc.close()
            }
        }
    )
    // overlayクリックで閉じる
    $(document).on("click", ".l_gnavSubListPc_overlay", function () {
        ui.subMenuPc.close()
    })
    // escキーで閉じる
    $(document).keyup(function (e) {
        if (e.key === "Escape") {
            ui.subMenuPc.close()
        }
    })
})
