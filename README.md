# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

## 開発・検証

```sh
pnpm install --frozen-lockfile
pnpm dev
pnpm lint
pnpm build
```

## ルーティング

TanStack Routerのファイルベースルーティングを使用しています。

- `src/routes/__root.tsx`: 共通レイアウトと存在しないURLの画面。
- `src/routes/index.tsx`: `/` に既存の `App` を表示。
- `src/router.ts`: Routerの作成と型登録。
- `src/main.tsx`: `RouterProvider` でアプリケーションを起動。

新しいページは `src/routes/` に追加し、`createFileRoute` で定義します。
アプリ内の移動には `@tanstack/react-router` の `Link` を使用してください。
Viteプラグインが開発サーバーの起動時・ビルド時に `src/routeTree.gen.ts` を
自動生成し、ページのコード分割を行います。この生成ファイルはGitで管理し、
手動では編集しません。`pnpm build` はルート生成後にTypeScriptの型検査を実行します。

本番ホスティングでは、各URLへの直接アクセスを `index.html` に返す
SPAフォールバックを設定してください。

参考: [TanStack RouterのVite導入ガイド](https://tanstack.com/router/latest/docs/installation/with-vite)

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend enabling type-aware lint rules by installing `oxlint-tsgolint` and editing `.oxlintrc.json`:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "options": {
    "typeAware": true
  },
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```

See the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules) for the full list of rules and categories.
