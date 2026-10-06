# science-study

科学現象を図と操作で学ぶWeb教材。
React、TypeScript、Vite、TanStack Router、Mantineによる単一のSPAです。
レンズと鏡では、同じ葉をのぞいたり近づけたりする場面から、道具の面と目へ届く光をたどります。
教材の目的、対象読者、このアプリ固有の学習要件は[プロジェクトの教材設計](docs/project-design.md)にまとめています。
実装済みの教材とURLは、その[教材の範囲](docs/project-design.md#教材の範囲)を参照してください。

## 必要環境

- Node.js 24を開発基準とします
- pnpm 11

バージョンはリポジトリで固定していません。
依存関係は `pnpm-lock.yaml` を使います。

## セットアップと起動

リポジトリのルートで実行します。

```sh
pnpm install --frozen-lockfile
pnpm dev
```

Viteが表示するローカルURLを開きます（通常は `http://localhost:5173`）。
既存サーバーが同じチェックアウトを参照していれば利用できます。

## 検証コマンド

コマンドの実装は[package.json](package.json)の `scripts`、実行方法の正本はこのREADMEです。

| コマンド | 用途 |
| --- | --- |
| `pnpm lint` | oxlint |
| `pnpm typecheck` | TypeScriptのプロジェクト型検査 |
| `pnpm test` | Vitestを一度実行。科学モデル、UI、教材設計表、src命名を検査 |
| `pnpm test:watch` | Vitestの継続実行 |
| `pnpm build` | Viteのビルドと型検査。出力は `dist/` |
| `pnpm preview` | ビルド済み `dist/` のローカル確認 |
| `git diff --check` | 差分の空白エラー確認 |
| `pnpm exec wrangler login` | 公開を行う人のCloudflare初回ログイン |
| `pnpm run deploy` | ビルド成功後にCloudflareへ手動公開。通常の検証では実行しない |

コード、教材を変更したらlint、型検査、test、buildを実行し、UIの変更はPC幅と390px程度の実ブラウザで確認します。
文書だけの変更はリンク、コマンド、内容の整合と差分を検証します。
テストは制作者向けです。
現実へのモデルの適合や学習効果は、自動テストの合格だけでは確認できません。
検証範囲と完了条件は[AGENTS.md](AGENTS.md#検証と完了条件)、実画面での確認内容は[設計契約](docs/content-design.md#実画面で確認すること)を参照してください。

## 構成

| パス | 責務 |
| --- | --- |
| `src/routes/` | URLとページの接続 |
| `src/app/` | ホーム、分野の入口、ナビゲーション、共通テーマ |
| `src/components/lesson.tsx` | 教材の共通構成と内容契約 |
| `src/experiments/<分野>/<テーマ>/` | meta、lesson.md、model、図、条件操作、ページとテスト |
| `src/experiments/mechanics/shared/` | 2題で使う時刻制御、描画、グラフ |
| `tests/` | Node.jsによる教材設計表、src命名の検査 |
| `docs/` | 構成、開発手順、教材方針、共通の制作原則、文章規範と設計テンプレート |

srcの命名規約と固定名例外は[開発ガイド](docs/development.md#ファイルとディレクトリの命名)を参照してください。
`src/route-tree.gen.ts` は生成ファイルです。
手で編集せずbuildで生成し、Gitに含めます。
公開にはSPAフォールバックが必要です。
既存のCloudflare静的アセット設定と手動公開手順は[開発ガイド](docs/development.md#公開)を参照してください。

## 変更前に読む文書

- [AGENTS.md](AGENTS.md)：作業範囲、ユーザー作業の保護、検証とレビューの完了条件
- [アーキテクチャ](docs/architecture.md)：構成、責務境界、依存方向と設計判断
- [教材の設計契約](docs/content-design.md)：他分野、他プロジェクトでも使う、具体的な状況から関係、抽象化へ進む制作原則
- [プロジェクトの教材設計](docs/project-design.md)：science-studyの目的、対象読者、教材と概念の範囲、科学的な制約
- [教材の文章と図の規範](docs/writing-guidelines.md)：命名、段落、図と文章、科学的な表現
- [開発ガイド](docs/development.md)：ファイル命名、標準部品、教材追加と手動公開の手順
- [教材設計テンプレート](docs/templates/lesson.md)：各教材の `lesson.md` に残す4つの設計表

変更する教材の `lesson.md` も読み、式、単位、成立条件、参考資料と表示用TSXをそろえて更新します。
