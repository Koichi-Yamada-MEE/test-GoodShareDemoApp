// ****************************************************************
// レスポンシブ関連
// ****************************************************************

// *************************** 初期設定 ***************************
const responsive = {
    breakpoint: 768,
    pc: {
        header_hight: 108, // スクロール時に考慮すべきヘッダー高さ
    },
    sp: {
        header_hight: 50, // スクロール時に考慮すべきヘッダー高さ
    },
    // PC/SP判定
    isMobile: function () {
        return !mediaQueryList.matches
    },
    isSp: function () {
        return this.isMobile()
    },
    isPc: function () {
        return !this.isMobile()
    },
    // PC/SPに応じたヘッダー高さを返す
    getHeaderHight: function () {
        return this.isMobile() ? this.sp.header_hight : this.pc.header_hight
    },
}
const mediaQueryList = window.matchMedia(
    `screen and (min-width: ${responsive.breakpoint}px)`
)
// ****************************************************************

$(document).on("load.page", function () {
    // PC/SPが切り替わったときだけ発火するイベント登録
    // resizeだと画面サイズが変わるたびに発火するので無駄
    mediaQueryList.addEventListener("change", function (event) {
        $(document).trigger("change.breakpoint")
        if (event.matches) {
            $(document).trigger("change.to.pc")
        } else {
            $(document).trigger("change.to.sp").trigger("change.to.mobile")
        }
    })
})
