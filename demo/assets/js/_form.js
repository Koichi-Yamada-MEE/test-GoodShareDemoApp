// ****************************************************************
// フォーム関連
// ****************************************************************

// *************************** 初期設定 ***************************
const form = {
    convertMinutesToHours: function (m) {
        const hh = Math.floor(m / 60)
        const mm = m % 60
        const tx = (hh > 0 ? hh + "時間" : "") + (mm > 0 ? mm + "分" : "")
        return tx != "" ? tx : "0分"
    },
}
// ****************************************************************

$(document).on("load.page", function () {
    // フォーム送信でローディングアニメーション
    $(document).on("submit", "form", function () {
        $("#loading_overlay").show()
    })
    // ラジオボタン クリックでアコーディオン開く
    $(document).on("click", ".radioList", function () {
        var type = ""
        if ($(this).hasClass("checked")) {
            return false
        }
        $(".radioList").removeClass("checked")
        $(".radioList").children(".radioContent").slideUp("300")
        $(this).addClass("checked")
        $(this).children(".radioContent").slideDown("300")
        type = $(this).data("type")
        if (type === $(this).data("type")) {
            return
        }
    })
    // buttonのバブリング無効化
    $(document).on("click", ".radioContent button", function (e) {
        e.stopPropagation()
        e.preventDefault()
    })
    // 複合ラジオエリア選択
    // 選択肢枠をクリックしたとき
    $(document).on("click", ".js_radioGroup .js_radio", function (e) {
        const $radio = $(this)
            .closest(".js_radioGroup")
            .find('input[type="radio"]')
        const $complex = $(this)
            .closest(".js_radioGroup")
            .find(".c_radioComplex")
        // 一旦全てリセット
        $radio.prop("checked", false)
        $complex.removeClass("_checked _focus")
        // クリックした選択肢を有効に
        $(this).addClass("_checked _focus").find($radio).prop("checked", true)
    })
    // ラジオボタンにフォーカスがあたったとき
    $(document).on("focus", '.js_radioGroup input[type="radio"]', function () {
        $(this).closest(".js_radio").addClass("_focus")
    })
    // ラジオボタンからフォーカスが外れたとき
    $(document).on("blur", '.js_radioGroup input[type="radio"]', function () {
        var isComplexChecked = $(this).closest(".js_radio").hasClass("_checked")
        if (isComplexChecked) {
            $(this).closest(".js_radio").removeClass("_focus")
        }
    })
    // エラーがある場合はinput要素にも _error クラスをつける
    $("p._error").each(function () {
        var parts = $(this).attr("id").split("-")
        $(':input[name="' + parts[0] + '"]').addClass("_error")
    })
    // 郵便番号検索
    ZipForm.init()
    // 画像アップロード
    ImgForm.init()
    // CSRF
    const $form_need_csrf = $("form.need_csrf")
    const load_csrf_url = "/house-cleaning/data/csrf/"
    if ($form_need_csrf.length) {
        // CSRFタグが読み込まれるまで送信ボタンを無効化
        $("#loading_overlay").fadeIn(300)
        const $submit = $form_need_csrf.find(":submit")
        $submit.attr("disabled", "disabled").addClass("disabled")
        $.ajax({
            type: "get",
            url: load_csrf_url,
            dataType: "json",
        }).done(function (response) {
            if ("csrf_name" in response && "csrf_value" in response) {
                const $input_csrf = $("<input>")
                    .attr({
                        type: "hidden",
                        name: response.csrf_name,
                        value: response.csrf_value,
                    })
                    .hide()
                $form_need_csrf.append($input_csrf)
                $submit.removeAttr("disabled").removeClass("disabled")
            }
            $("#loading_overlay").fadeOut(300)
        })
    }
    // メニュー情報
    const $menu_price = $(".menu_price")
    const $menu_time = $(".menu_time")
    const load_menu_url = "/house-cleaning/data/menu/"
    let menu_ids = []
    if ($menu_price.length || $menu_time.length) {
        $menu_price.add($menu_time).each(function () {
            if (!$(this).data("menu_id")) return true
            if (menu_ids.indexOf($(this).data("menu_id")) !== -1) return true
            menu_ids.push($(this).data("menu_id"))
        })
        $.ajax({
            type: "get",
            url: load_menu_url,
            data: {
                ids: menu_ids,
            },
            dataType: "json",
        }).done(function (response) {
            $menu_price.each(function () {
                if (!$(this).data("menu_id")) return true
                const menu_id = $(this).data("menu_id")
                const in_tax = !$(this).data("ex_tax")
                if (!(menu_id in response)) return true
                if (in_tax && "in_tax" in response[menu_id]) {
                    $(this).html(
                        Number(response[menu_id].in_tax).toLocaleString()
                    )
                } else if (!in_tax && "ex_tax" in response[menu_id]) {
                    $(this).html(
                        Number(response[menu_id].ex_tax).toLocaleString()
                    )
                }
            })
            $menu_time.each(function () {
                if (!$(this).data("menu_id")) return true
                const menu_id = $(this).data("menu_id")
                const view_hours = !$(this).data("view_minutes")
                if (!(menu_id in response) || !("minutes" in response[menu_id]))
                    return true
                if (view_hours) {
                    $(this).html(
                        form.convertMinutesToHours(response[menu_id].minutes)
                    )
                } else {
                    $(this).html(
                        Number(response[menu_id].minutes).toLocaleString() +
                            "分"
                    )
                }
            })
        })
    }
})

const ZipForm = (function () {
    // プロパティ
    const messages = {
            pattern_error: "入力された郵便番号の形式に誤りがあります",
            not_found_error: "郵便番号に該当する住所が見つかりません",
        },
        zip_pattern = /^(\d{3})-?(\d{4})$/g
    let $zip,
        target_names = {
            zip1: "zip",
            zip2: "",
            pref: "pref",
            city: "addr1",
            addr1: "addr2",
            addr2: "addr3",
        }
    // メソッド
    return {
        // 検索実行
        searchZip: function ($zip_element, success_method = false) {
            if (!this.checkPattern($zip_element.val())) {
                alert(messages.pattern_error)
                return false
            }
            AjaxZip3.zip2addr(
                target_names.zip1,
                target_names.zip2,
                target_names.pref,
                target_names.city,
                target_names.addr1,
                target_names.addr2
            )
            //成功時に実行する処理
            AjaxZip3.onSuccess = success_method
            //失敗時に実行する処理
            AjaxZip3.onFailure = function () {
                alert(messages.not_found_error)
            }
            return false
        },
        // 初期設定
        init: function () {
            $zip = $(':input[name="zip"]')
            if ($(".schedule-form").length) {
                this.initSchedule()
            } else if ($("select#pref").length) {
                this.initFormV1()
            } else if ($("input#pref").length) {
                this.initFormV2()
            }
        },
        // 日付から探す用
        initSchedule: function () {
            const sendScheduleForm = function () {
                $(".schedule-form").submit()
            }
            const main = this
            target_names.pref = "pref_name"
            target_names.city = "city_name"
            target_names.addr1 = ""
            target_names.addr2 = ""
            // イベント
            $(".ajaxzip3").on("change", function () {
                return main.searchZip($(this))
            })
            $(".c_searchBox_btn").on("click", function () {
                return main.searchZip($zip, sendScheduleForm)
            })
        },
        // 会員登録や住所入力用 ver 1
        initFormV1: function () {
            const $pref = $("#pref")
            const changePref = function () {
                $pref.trigger("change")
            }
            const main = this
            target_names.city = "addr1_text"
            target_names.addr1 = "addr2"
            // イベント
            $(".ajaxzip3").on("click", function () {
                return main.searchZip($zip, changePref)
            })
            $pref.on("change", function () {
                if ($pref.val()) {
                    $.ajax({
                        type: "get",
                        url: $pref.data("url"),
                        data: {
                            name: "addr1",
                            pref_id: $pref.val(),
                            city_id: $("#addr1").val(),
                            city_text: $("#addr1_text").val(),
                            class: "p-locality",
                        },
                        dataType: "json",
                        beforeSend: function () {
                            $("#loading_overlay").show()
                            $("#btn_submit,.btn_new,.btn_assign")
                                .prop("disabled", true)
                                .addClass("_disabled")
                        },
                        success: function (response) {
                            $('select[name="addr1"],select[name="pref"]')
                                .removeClass("u_ta_l c_btn _disabled")
                                .prop("tabindex", "")
                            $("#addr1_area").html(response.select)
                            $(".p-street-address").val(
                                response.ward + $(".p-street-address").val()
                            )
                            if (response.selected) {
                                $("#addr1").val(response.selected)
                                $('select[name="addr1"],select[name="pref"]')
                                    .addClass("u_ta_l c_btn _disabled")
                                    .prop("tabindex", "-1")
                            }
                        },
                        complete: function () {
                            $("#loading_overlay").hide()
                            $("#btn_submit,.btn_new,.btn_assign")
                                .prop("disabled", false)
                                .removeClass("_disabled")
                        },
                    })
                }
            })
            // 「戻る」で戻ってきた＆都道府県が選択済み
            if ($pref.val() != "") {
                $pref.trigger("change")
            }
        },
        // 会員登録や住所入力用 ver 2
        initFormV2: function () {
            const main = this
            // イベント
            $(".ajaxzip3").on("click", function () {
                return main.searchZip($zip)
            })
        },
        // 郵便番号パターンチェック
        checkPattern: function (zip) {
            let regcheck = zip_pattern.exec(zip)
            zip_pattern.lastIndex = 0
            if (!regcheck || regcheck[1] == "000") {
                return false
            } else {
                return true
            }
        },
    }
})()

const FileManager = (function () {
    // プロパティ
    const file_list = {}
    const default_max_num_files = 4 // 一つの添付フォームで添付できるファイルの最大数
    // メソッド
    return {
        // 一つの添付フォームで添付できるファイルの最大数
        max_num_files: default_max_num_files,
        setMaxNumFiles(val) {
            this.max_num_files = val
        },
        resetMaxNumFiles() {
            this.max_num_files = default_max_num_files
        },
        // 初期設定
        init: function () {},
        make: function (name) {
            if (this.has(name)) return
            file_list[name] = new Array()
        },
        // 判定
        has: function (name, index = false) {
            if (!(name in file_list)) return false
            if (index === false) return true
            return file_list[name].length > index
        },
        hasFileList: function (name) {
            return this.has(name)
        },
        hasFile: function (name, index = 0) {
            return this.has(name, index)
        },
        // ファイル情報取得
        get: function (name, index = false) {
            if (!this.has(name, index)) return false
            if (index === false) return file_list[name]
            return file_list[name][index]
        },
        getFileList: function (name) {
            return this.get(name)
        },
        getFile: function (name, index = 0) {
            return this.get(name, index)
        },
        // ファイル上書き
        setFileList: function (name, files) {
            if (!Array.isArray(files)) files = [files]
            file_list[name] = files
            this.deleteOverFile(name)
        },
        setFile: function (name, index = 0, file) {
            this.make(name)
            file_list[name][index] = file
            this.deleteOverFile(name)
        },
        // ファイル追加
        addFileList: function (name, files) {
            if (!Array.isArray(files)) files = [files]
            this.make(name)
            file_list[name] = file_list[name].concat(files)
            this.deleteOverFile(name)
        },
        addFile: function (name, file) {
            // console.log('addFile', name, file)
            this.make(name)
            file_list[name].push(file)
            this.deleteOverFile(name)
        },
        // ファイル削除
        deleteFileList: function (name) {
            if (!this.has(name)) return false
            file_list[name] = new Array()
        },
        deleteFile: function (name, index = 0) {
            if (!this.has(name, index)) return false
            file_list[name].splice(index, 1)
        },
        // ４つ以上は削除
        deleteOverFile: function (name) {
            if (!this.has(name) || file_list[name].length < this.max_num_files)
                return false
            file_list[name].splice(this.max_num_files)
        },
    }
})()

const ImgForm = (function () {
    // プロパティ
    // const max_dimension = 1000 // 最大ピクセルサイズ
    // const max_file_size = 2097152 // 最大ファイルサイズ
    const allow_file_types = [
        "application/pdf",
        "image/apng",
        "image/gif",
        "image/jpeg",
        "image/png",
        "image/webp",
    ]
    const upload_ajax_url = "/data/upload_file"
    // メソッド
    return {
        updateImgList: function (name) {
            const main = this
            let file_list = FileManager.getFileList(name)
            let $file_input = $("#" + name + "-up")
            $file_input.val("")
            for (let i = 0; i < FileManager.max_num_files; i++) {
                let $item = $("#" + name + "_box_" + i)
                let $savefile = $item.find(".savefile")
                if (
                    !FileManager.hasFileList(name) ||
                    file_list.length <= i ||
                    !("tmp_src" in file_list[i]) ||
                    !("s3_path" in file_list[i])
                ) {
                    $item
                        .removeClass("uploaded")
                        .find("img")
                        .hide()
                        .attr("src", "")
                    $item.find(".removebtn").hide()
                    $savefile.val("")
                    continue
                }
                let file = file_list[i]
                // console.log("file", name, i, file)
                $item
                    .addClass("uploaded")
                    .show()
                    .find("img")
                    .attr("src", file.tmp_src)
                    .show()
                $item.find(".removebtn").show()
                $savefile.val(file.s3_path)
            }
        },
        upload: function (element) {
            const main = this
            const name = $(element).data("name")
            const $input_csrf = $("#input_csrf")
            const fd = new FormData()
            const files = element.files
            // console.log(files, element.files, $(element)[0].files)
            return new Promise(function (resolve, reject) {
                if (!files || !files.length) {
                    reject("ファイルが選択されていません。")
                }
                for (let i = 0; i < files.length; i++) {
                    if (!allow_file_types.includes(files[i].type)) {
                        reject(
                            files[i].name +
                                " は登録可能なファイルではありません。"
                        )
                    }
                    fd.append(name + "[]", files[i])
                }
                let errors = []
                fd.append($input_csrf.attr("name"), $input_csrf.val())
                $("#loading_overlay").fadeIn(300)
                $.ajax({
                    url: upload_ajax_url,
                    type: "post",
                    data: fd,
                    processData: false,
                    contentType: false,
                    cache: false,
                })
                    .done(function (data) {
                        if ("csrf_value" in data)
                            $input_csrf.val(data.csrf_value)
                        // 成功時の処理
                        if (
                            !("result" in data) ||
                            !data.result ||
                            !("upfiles" in data) ||
                            !Array.isArray(data.upfiles)
                        ) {
                            reject("ファイルのアップロード処理に失敗しました。")
                        } else {
                            for (let j = 0; j < data.upfiles.length; j++) {
                                if ("error_message" in data.upfiles[j]) {
                                    errors.push(
                                        "【" +
                                            data.upfiles[j].name +
                                            "】" +
                                            data.upfiles[j].error_message
                                    )
                                } else {
                                    FileManager.addFile(name, data.upfiles[j])
                                }
                            }
                            if (!errors.length) {
                                resolve(data.upfiles.length)
                            }
                            reject(errors.join("\n"))
                        }
                    })
                    .fail(function () {
                        // 失敗時の処理
                        reject(
                            "通信エラーによりファイルのアップロードに失敗しました。"
                        )
                    })
                    .always(function () {
                        $("#loading_overlay").fadeOut(300)
                    })
            })
        },
        init: function () {
            const main = this
            const $file_input = $(
                ".c_fileUpload_btn input, .c_messageInput_photo input"
            )
            const $remove_btn = $(".removebtn")
            const $save_file = $(".c_fileUpload_wrap .savefile")
            let setup_names = []
            if ($file_input.data("max_num_files")) {
                // ToDo : 画像投稿フォームが複数になることを想定したら、画像を添付できる最大値などの設定はフォームごとに変えられる必要がある。FileManager はファイルアップロードフォームの数だけ必要になる
                FileManager.setMaxNumFiles($file_input.data("max_num_files"))
            }
            $file_input.on("change", function (e) {
                let name = $(this).data("name")
                // console.log("file_input change")
                main.upload(this)
                    .then(function (uploaded_length) {
                        console.log("uploaded length", uploaded_length)
                    })
                    .catch(function (error) {
                        console.log("upload error", error)
                        alert(error)
                    })
                    .finally(function () {
                        // すべてアップロード完了したら更新
                        main.updateImgList(name)
                    })
                return false
            })
            // 削除ボタン
            $remove_btn.on("click", function () {
                let $item = $(this).closest(".item")
                let name = $item.data("name")
                let index = $item.data("index")
                FileManager.deleteFile(name, index)
                main.updateImgList(name)
                return false
            })
            // デフォルト値
            let default_count = $save_file.length
            $save_file.each(function (index) {
                let val = $(this).val()
                let $item = $(this).closest(".item")
                let name = $item.data("name")
                let src = $item.find(".img").attr("src")
                if (!(name in setup_names)) {
                    setup_names.push(name)
                }
                // console.log(val, src, $(this))
                if (val != "") {
                    let file_data = {
                        s3_path: val,
                        tmp_src: src,
                    }
                    FileManager.addFile(name, file_data)
                }
                // ラスト
                if (index + 1 == $save_file.length) {
                    for (let i = 0; i < setup_names.length; i++) {
                        main.updateImgList(setup_names[i])
                    }
                }
            })
        },
    }
})()
