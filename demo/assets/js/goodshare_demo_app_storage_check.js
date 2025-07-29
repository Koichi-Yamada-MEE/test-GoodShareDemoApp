/******************************************
 * エラーメッセージを表示する + セッションチェック
 ******************************************/

const showAlert = (errorCode) => {
  // すでにアラートを表示したか確認
  if (sessionStorage.getItem("alertShown")) return;

  const message = `セッションが切れているか、データが読み込まれていないため、最初の画面に戻ります。（${errorCode}）`;
  alert(message);

  // アラート表示済みフラグをセット
  sessionStorage.setItem("alertShown", "true");

  // チュートリアル画面へ遷移
  window.location.href = "../tutorial/";
};

// セッションストレージチェックを関数化
const checkSessionStorage = () => {
  const jsonData = sessionStorage.getItem("demoAppData");
  if (!jsonData) {
    showAlert("E001：セッションストレージのJSONデータが見つかりません");
    return null;
  }
  return jsonData;
};

// DOM読み込み後に実行（安全）
window.addEventListener("DOMContentLoaded", () => {
  checkSessionStorage();
});
