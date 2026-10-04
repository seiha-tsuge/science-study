# 科学の実験室 — science-study

問いを立て、予想し、条件を変え、結果を説明するための個人実験室です。
React・TypeScript・Vite・TanStack Router を使った単一の SPA です。

## 最初の学習

1. `/` の学習マップで、概念のつながりを見る。
2. `/mechanics` で力学の問いを選ぶ。
3. `/mechanics/motion` で位置と速度を学ぶ。
4. `/mechanics/acceleration` で等速運動と等加速度運動を比較する。

各教材は「問い → 予想 → 実験・グラフ → 数式 → 自分の言葉で説明 → 別条件で再挑戦」の流れです。
予想を選んでから実験と解説を開きます。「まだ分からない」も選べます。
初期位置・速度・加速度を変え、再生・一時停止・初期化・時刻の指定ができます。
グラフは位置と速度を切り替えられ、比較条件の数値も確認できます。

位置と速度の解説には、React・SVG・GSAPによる22秒の説明アニメーションがあります。
座標 → 運動 → 位置の印 → 変位 → グラフ → 式の順に確認できます。
再生・一時停止・初期化・説明の時間指定・場面の選択ができ、開いた直後は停止しています。
説明の条件は x₀ = 0 m、v = 5 m/sで固定し、実験で選んだ条件とは独立しています。
説明の2〜6秒で物理時刻が0〜4秒まで進み、その後は4秒の位置に止めて説明します。
動きを減らす設定では静止画の場面選択で確認できます。解説を閉じると再生も終了します。

描画とグラフは解析式から計算した値で、実測データではありません。
モデルの単位は m・s、右向きを正とします。画面のピクセルは描画側で変換します。
p5.js は実験を始めたときに読み込みます。

## 開発・検証

Node.js 24 と pnpm 11 を使用します。

```sh
pnpm install --frozen-lockfile
pnpm dev
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

`pnpm test:watch` でモデルのテストを継続実行できます。
`pnpm build` はルート生成・本番ビルドの後に型検査を行います。
CI では lint・型検査・モデルテスト・ビルドをそれぞれ実行します。

## 学習メモ

画面の予想や再挑戦の選択は一時的なものです。再読み込みやページ移動で消えます。
ブラウザ内のノート保存・同期機能は設けず、エディタや AI との対話で Markdown を更新します。

- [学習メモのテンプレート](notes/journal/TEMPLATE.md) を日付入りの別ファイルにコピーする。
- 操作前に、自分の予想と根拠を書く。AI に予想を代筆させない。
- 実験の URL、条件、観察、理解の変化、未解決の問いを残す。
- 複数の実験につながる理解ができたら `notes/concepts/` にまとめる。

教材は `src/experiments/`、個人の学習履歴は `notes/` に分けています。

## 構成と教材の追加

- `src/routes/`: URL とページの接続。科学計算は置かない。
- `src/app/`: 共通レイアウト、学習マップ、分野の入口。
- `src/experiments/mechanics/{motion,acceleration}/`: 問い、教材、純粋な計算モデルとテスト、操作 UI。
- `src/experiments/mechanics/motion/ExplanationAnimation.tsx`: 等速運動の説明。SVGの表示とGSAPの演出を担当。
- `src/experiments/mechanics/shared/`: 2題で共通の時刻制御、描画、グラフと操作部品。
- `src/components/Lesson.tsx`: 学習の流れ。進捗を保存する学習管理システムにはしない。
- [設計・追加手順](docs/architecture.md)
- [学習範囲と必要な数学](docs/learning-map.md)

TanStack Router のファイルベースルーティングを使います。
`src/routeTree.gen.ts` は Vite プラグインが生成するため、手で編集しません。
生成ファイルは Git に含め、新しいルートを追加したら `pnpm build` で更新してください。

公開時は任意の URL への直接アクセスを `index.html` に返す SPA フォールバックが必要です。
個人の学習メモの公開範囲は、公開前に別途決めます。

## 資料

- [OpenStax: Motion with Constant Acceleration](https://openstax.org/books/university-physics-volume-1/pages/3-4-motion-with-constant-acceleration): 式と成立条件。
- [PhET](https://phet.colorado.edu/): 既存の実験を触り、問いを見つけるための入口。
- [p5.js instance mode](https://p5js.org/reference/p5/p5/): 描画をスケッチのインスタンスに閉じ込める。
