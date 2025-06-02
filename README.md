<div align='center'>
  <picture>
    <img src="https://www.mitsubishielectric.co.jp/home/goodshare/img/about_ttl.png" alt="空気をシェアして暮らしを快適に。Good Share!" width='300px'/>
  </picture>
</div>

# Good Share！（グッシェア）デモアプリ

7月公開予定の[Good Share！（グッシェア）](https://www.mitsubishielectric.co.jp/home/goodshare/)に登録されるデモアプリです。[`GitHub Pages`](https://docs.github.com/ja/pages/getting-started-with-github-pages/what-is-github-pages)を利用しブラウザ表示させてレビューします。

## 概要

デモアプリを使いウェブで簡単にアプリ操作を体験することができます。ツアーガイドのJavaScriptライブラリ[`driver.js`](https://driverjs.com/)を利用し、操作説明などは`popover`で説明しています。

APIによるデータの受け渡しはせず、ブラウザのセッションストレージを利用し、全てフロント側で処理しています。また、アプリ画面や各コンポーネント（ボタンやカードなど）はイメージ画像を使用しています。そのため、CSSでデザインされたコンポーネントをレンダリングするのではなく、イメージ画像を座標でレイアウトしています。

## 使い方

`GitHub Pages`にアクセスするとチュートリアル画面が最初に表示されます。以降は画面に従い進んで下さい。
> [!NOTE]
> チュートリアル画面を最初に表示することが必要です。セッションストレージにJSONが保存され、以降の操作にはJSONの値を参照しながら表示を切り替えます。# test-GoodShareDemoApp
