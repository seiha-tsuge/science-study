# science-studyの開発ガイド

この文書は、教材を実装する開発者が使う規約、追加手順と公開手順をまとめる。
システムの責務境界は[アーキテクチャ](architecture.md)、セットアップと実行コマンドの正本は[README](../README.md)を参照する。
教材を設計する前に、[教材方針](project-design.md)、[共通の教材設計](content-design.md)、[文章と図の規範](writing-guidelines.md)を読む。

## ファイルとディレクトリの命名

`src/` 配下のファイル名とディレクトリ名は、小文字とハイフン区切り（kebab-case）に統一する。
拡張子と意味のある `.test`、`.spec`、`.d`、`.gen` の接尾辞は保つ。
例：`lesson-page.tsx`、`model.test.ts`。
Reactコンポーネント名や型、変数など、コード内の識別子はPascalCase、camelCaseなど既存の規則を保つ。
TanStack Routerが固定名で探索する `src/routes/__root.tsx` だけを例外とする。
生成ファイルは `src/route-tree.gen.ts`。
`vite.config.ts` の `generatedRouteTree` で名前を指定し、手で編集せずbuildで生成する。
ルートは `src/routes/mechanics/motion.tsx` のように分野のディレクトリへ置き、ファイル名の変更で公開URLを変えない。

変更前に同名、大文字小文字を無視した衝突を確認する。
大文字小文字を区別しないMacでは一意の中間名を経由して移動し、ファイルの内容を保つ。
import、export、動的import、glob、テスト探索、ルート設定、文書参照を更新し、Gitの差分でも旧新パスの対応を確認する。
`tests/source-naming.test.ts` が固定例外以外の名前を検査し、`tests/lesson-design.test.ts` が `lesson-page.tsx` から教材を探索する。
コマンドはREADMEの検証一覧を参照し、型検査、test、buildで参照解決と生成ルートを確認する。

## 標準部品の使い分け

操作の役割は[共通設計](content-design.md#説明と操作を一緒に設計する)で決め、このプロジェクトでは次のMantine部品へ対応させる。

| 役割 | 標準部品 |
| --- | --- |
| 場面を選ぶ | 独立した場面は `Tabs`、特定の静止場面はラベル付き `Button` |
| 図の見方を選ぶ | 排他的な選択は `SegmentedControl`、独立した表示の有無は `Switch` |
| 条件を変える | `Slider`、同じ確定状態を使う `NumberInput`、物質は `NativeSelect` |
| 時間を選ぶ、再生する | 静止場面と再生、停止、初期化の `Button`、時刻の `Slider` |
| 詳細を開く | `Accordion` または共通Lessonの開閉 |

## モデルと表示の実装規約

科学の計算は純粋な `model.ts` に置き、SI単位を使う。
TSXは計算結果を表示座標へ変換し、React状態は確定した条件と比較基準を保持する。
数値入力は編集中の表記を保ち、Enterまたはblurで確定させる。
同じ条件を扱うSliderとNumberInputには、同じ確定値を渡す。

一方、モデルの式を実装しただけでは現実への適合は確認できない。
数値積分を導入する場合は解析解、刻みと収束、保存量の誤差を照合し、確率的なモデルではシードと複数回の試行を記録する。
実測を使う場合は測定方法、単位と不確かさを残す。
分野の定義、前提と資料に基づいて検証の期待値を決める。

## 教材を追加する手順

1. `docs/project-design.md`、`docs/content-design.md`、`docs/writing-guidelines.md` を読み、現実世界の行為、そのとき起きること、理解する関係と範囲を定め、教材方針の範囲から中心の問いを決める。
2. `docs/templates/lesson.md` から各教材の `lesson.md` を作り、「今回理解すること」の表を画面のゴールとそろえ、問いを図で指せる関係へ分ける。
   一対一の設計欄を記入し、共通の必須ルールの判定表で照合する。
   橋渡し、概念、場面の設計表へ図の対象と操作、配置、切り替え時の状態を具体的に記す。
3. `src/experiments/<分野>/<テーマ>/` に `meta.ts`、`lesson-page.tsx` と必要な図、操作を置く。
科学モデルと検査は既存の共用実装を参照できる。
必要な場合だけ `model.ts` とその検査を追加する。
   設計表に沿って説明と図を組み立てる。
4. モデルは SI 単位で扱い、既知の解、不変量、対称性など科学的な期待値をテストする。
5. routes にページをつなぎ、学習マップと分野ページに概念のつながりを示す。
6. 本文と図をレビューし、身近な場面から渡す関係とその限界、前提、比較対象、問いの説明、現象への接続を確認する。
   設計表と実装の対応をそろえる。
7. lint、型検査、テスト、ビルドを実行し、設計表の構造検査と生成ルートも確認する。
8. 共通設計の「実画面で確認すること」に沿ってブラウザを一周する。
   広い画面と390pxを目安にした狭い画面で、条件の境界や変化しない場合、入力と図の同期、キーボード、再生、停止、初期化、詳細、離脱を確認し、幅、操作、未確認事項を報告する。

## 教材の記録と自動検査

各教材の `lesson.md` は、[テンプレート](templates/lesson.md)に従って一対一の設計欄、四つの設計表、モデルの条件と検証範囲を記録する。
`tests/lesson-design.test.ts` は教材ページを自動探索し、表の欠落、列と空欄を確認するため、新規教材の手動登録は不要である。
テンプレートの列も照合するが、構造の検査だけで説明の意味と科学的な妥当性を判定できない。
それらは本文、図、モデルと参考資料でレビューする。

文書を読むNode.jsの検査は `tests/` に置き、`tsconfig.node.json` で型検査する。
ブラウザへNode.jsの型とファイル読み取りを持ち込まない。
制作者の設計記録はブラウザの保存機能や学習者の履歴に転用しない。

## 公開

Viteのビルド結果 `dist/` をCloudflare Workersの静的アセットとして手動で公開する。
`wrangler.jsonc` は配信先の名前、互換性の日付、配信ディレクトリ、SPAフォールバックを定義する。
READMEのdeployスクリプトは、buildが成功した場合だけWranglerの公開を実行する。
教材URLへの直接アクセスは `single-page-application` 設定で `index.html` に接続し、TanStack Routerがページを選ぶ。
Workerのサーバー処理やGitHub連携による自動公開は追加しない。
公開範囲は `dist/` に限り、設計用のMarkdownは配信しない。
Wranglerのローカル状態 `.wrangler/` はGitの管理対象から除外する。
初回はREADMEのCloudflareログインコマンドで認証する。
公開の指示があるときだけREADMEの検証とdeployを実行する。
公開後は表示されたworkers.dev URLで、ホーム、教材URLへの直接アクセス、再読み込みを確認する。
pushだけでは公開されない。

## 実装で参照する公式資料

- [TanStack Router + Vite](https://tanstack.com/router/latest/docs/installation/with-vite)
- [p5 instance mode](https://p5js.org/reference/p5/p5/)
- [requestAnimationFrame](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame)
- [GSAP + React](https://gsap.com/resources/React/)
- [Vitest](https://vitest.dev/guide/)
- [Mantine + Vite](https://mantine.dev/guides/vite/)
