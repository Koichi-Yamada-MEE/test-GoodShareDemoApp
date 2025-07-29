/******************************************
 * エラーメッセージを表示する
 ******************************************/

const showAlert = (errorCode) => {
  // すでにアラートを表示したか確認
  if (sessionStorage.getItem("alertShown")) return;

  const message = `セッションが切れているか、データが読み込まれていないため、最初の画面に戻ります。（${errorCode}）`;
  alert(message);

  // アラート表示済みフラグをセット
  sessionStorage.setItem("alertShown", "true");

  // 遷移
  window.location.href = "../tutorial/";
};

/******************************************
 * ボタン関連
 ******************************************/
// イメージ要素を表示する
const showImg = (id) => {
  const element = document.getElementById(id);
  element ? (element.style.display = 'block') : null;
};


/******************************************
 * JSON操作
 ******************************************/
// プロパティの値を取得
const getJsonValue = (keyPath) => {
  const jsonData = sessionStorage.getItem("demoAppData");

  // セッションストレージのJSON読み込みエラー
  if (!jsonData) {
    showAlert("E001：セッションストレージのJSONデータが見つかりません");
    return null;
  }

  try {
    const data = JSON.parse(jsonData);
    const value = keyPath.split('.').reduce((obj, key) => obj && obj[key], data);

    // 指定されたプロパティが存在しない
    if (value === undefined) {
      showAlert("E002：指定されたプロパティが存在しません");
      return null;
    }
    return value;
    // JSONの解析に失敗した場合
  } catch (error) {
    showAlert("E003：JSONの解析に失敗しました");
    return null;
  }
};

// プロパティの値を更新
function setJsonValue(keyPath, newValue) {
  // セッションストレージからJSONデータを取得
  const jsonData = sessionStorage.getItem("demoAppData");
  // セッションストレージのJSON読み込みエラー
  if (!jsonData) {
    showAlert("E004：セッションストレージのJSONデータが見つかりません");
    return false;
  }

  try {
    const data = JSON.parse(jsonData);
    const keys = keyPath.split('.');
    let obj = data;

    // 最後のキーまで辿って対象のプロパティを更新
    for (let i = 0; i < keys.length - 1; i++) {
      if (!(keys[i] in obj)) {
        showAlert(`E005：指定されたキーが存在しません: ${keys[i]}`);
        return false;
      }
      obj = obj[keys[i]];
    }

    // 最後のキーに値をセット
    const lastKey = keys[keys.length - 1];
    if (!(lastKey in obj)) {
      showAlert(`E006：指定されたプロパティが見つかりません: ${lastKey}`);
      return false;
    }

    obj[lastKey] = newValue;

    // 変更後のデータをセッションストレージに保存
    sessionStorage.setItem("demoAppData", JSON.stringify(data));

    return true;
  } catch (error) {
    showAlert("E007：JSONの解析または更新に失敗しました", error);
    return false;
  }
}

// モーダルウインドウを表示
function showModal(modalId, modalPath) {
  const modalContainer = document.getElementById('modal-container');
  const modalImage = document.getElementById('modal-image');

  // modalContainer と modalImage が存在する場合
  if (modalContainer && modalImage) {
    modalContainer.id = modalId;
    modalImage.src = modalPath;
    modalContainer.style.display = 'block';
  } else {
    // エラー処理
    showAlert("E101：モーダルウインドウの表示に失敗しました");
  }
}

// モーダルウインドウを非表示
function hideModal(element) {
  const modal = element.closest(".modal-container");

  if (modal) {
    modal.style.display = "none";
  } else {
    // エラー処理
    showAlert("E102：モーダルウインドウの非表示に失敗しました");
  }
}

// 汎用的な処理（toggle/radio/mode）
function toggleButton(selectedImg) {
  // クリックされた要素から、最も近い親要素 .elements-container を取得
  const container = selectedImg.closest(".elements-container");
  if (!container) {
    showAlert("E201：ボタンのクラスセレクタが見つかりませんでした");
    return; // 見つからなかった場合は処理を中断
  }

  // クリックされたボタンの属性を[data-group]属性から取得
  const group = selectedImg.dataset.group;
  if (!group) {
    showAlert("E202：ボタンの属性値が見つかりませんでした");
    return; // 属性値が見つからなかった場合は処理を中断
  }

  // [data-group]属性から処理を分岐
  if (group === "toggle") {
    // ----- トグルスイッチ動作 -----
    const baseName = selectedImg.src.replace(/_on\.png|_off\.png/, "");
    selectedImg.src = selectedImg.src.includes("_on.png") ? `${baseName}_off.png` : `${baseName}_on.png`;
  } else {
    // ----- 排他的処理 -----
    const buttons = container.querySelectorAll(`.toggle-btn[data-group="${group}"]`);
    buttons.forEach(img => {
      const baseName = img.src.replace(/_on\.png|_off\.png/, "");
      img.src = (img === selectedImg) ? `${baseName}_on.png` : `${baseName}_off.png`;
    });
  }
}

// 無効ボタンをクリックしたときの処理
function showDemoAppRestrictionMessage() {
  alert('デモアプリではこのボタンは操作できません。');
}

/******************************************
 * Driver.js操作
 ******************************************/
// Driver.jsのツアーを実行する（基本パターン：進む／戻る／閉じる）
let driverObj; // グローバル定義
const startDriverTour = (steps) => {
  const driver = window.driver.js.driver;
  driverObj = driver({
    popoverClass: 'driverjs-theme',
    overlayOpacity: 0.4,
    animate: true,
    nextBtnText: '進む',
    prevBtnText: '戻る',
    doneBtnText: '閉じる',
    steps,
  });
  driverObj.drive();
};

// driver.js（送風ファンの運転ボタンを選択した時）
const popoverFan = () => {
  startDriverTour([
    {
      element: null,
      popover: { description: 'エアコンの状態に関わらず送風ファンは運転します。ここでは「強」に設定します。' }
    }
  ]);
};

// driver.js（環境センサー）
const popoverSensor = () => {
  startDriverTour([
    {
      element: null,
      popover: { description: 'ここでは脱衣所に設置した環境センサーとします。' }
    }
  ]);
};

// ポップオーバー（単体）を閉じる
const closePopover = () => {
  driverObj.destroy();
};


// ポップオーバー（モーダル）を閉じる
const closeModalPopover = () => {
  closePopover();
};
