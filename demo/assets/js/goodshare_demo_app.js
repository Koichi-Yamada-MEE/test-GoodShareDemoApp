/******************************************
 * エラーメッセージを表示する
 ******************************************/
function showAlert(errorCode) {
  const message = `最初からやり直してください。（${errorCode}）`;
  alert(message);
}

/******************************************
 * ボタン関連
 ******************************************/
// イメージ要素を表示する
function showImg(id) {
  const element = document.getElementById(id);
  if (element) {
    // 要素を表示する
    element.style.display = 'block';
  }
}

/******************************************
 * JSON操作
 ******************************************/
// プロパティの値を取得
function getJsonValue(keyPath) {
  // セッションストレージからJSONデータを取得
  const jsonData = sessionStorage.getItem("demoAppData");
  if (!jsonData) {
    console.error("データがセッションストレージにありません");
    return null;
  }

  try {
    const data = JSON.parse(jsonData);
    return keyPath.split('.').reduce((obj, key) => obj && obj[key], data);
  } catch (error) {
    console.error("JSONの解析に失敗しました", error);
    return null;
  }
}

// プロパティの値を更新
function setJsonValue(keyPath, newValue) {
  // セッションストレージからJSONデータを取得
  const jsonData = sessionStorage.getItem("demoAppData");
  if (!jsonData) {
    console.error("データがセッションストレージにありません");
    return false;
  }

  try {
    const data = JSON.parse(jsonData);
    const keys = keyPath.split('.');
    let obj = data;

    // 最後のキーまで辿って対象のプロパティを更新
    for (let i = 0; i < keys.length - 1; i++) {
      if (!(keys[i] in obj)) {
        console.error(`指定されたキーが存在しません: ${keys[i]}`);
        return false;
      }
      obj = obj[keys[i]];
    }

    // 最後のキーに値をセット
    const lastKey = keys[keys.length - 1];
    if (!(lastKey in obj)) {
      console.error(`指定されたプロパティが見つかりません: ${lastKey}`);
      return false;
    }

    obj[lastKey] = newValue;

    // 変更後のデータをセッションストレージに保存
    sessionStorage.setItem("demoAppData", JSON.stringify(data));

    return true;
  } catch (error) {
    console.error("JSONの解析または更新に失敗しました", error);
    return false;
  }
}

// モーダルウインドウを表示
function showModal(modalId, modalPath) {
  const modalContainer = document.getElementById('modal-container');
  const modalImage = document.getElementById('modal-image');

  modalContainer.id = modalId;
  modalImage.src = modalPath;
  modalContainer.style.display = 'block';
}

// モーダルウインドウを非表示
function hideModal(element) {
  const modal = element.closest(".modal-container");
  if (modal) {
    modal.style.display = "none";
  }
}

// 汎用的な処理（toggle/radio/mode）
function toggleButton(selectedImg) {
  // 1. クリックされた要素から、最も近い親の .elements-container を取得
  const container = selectedImg.closest(".elements-container");
  if (!container) return; // 見つからなかった場合は処理を中断

  // 2. クリックされたボタンが属するグループを、data-group 属性から取得
  const group = selectedImg.dataset.group;

  // 3. トグル動作かどうかを判定
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

function replaceElement(targetElementId, replaceFileName) {
  const targetElement = document.getElementById(targetElementId);
  targetElement.src = getJsonValue(baseUrl) + replaceFileName;
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

// ポップオーバーを閉じる
const closePopover = () => {
  driverObj.destroy(); // popoverを閉じる
};
