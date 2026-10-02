# 公開設定

本デモは既存施設版から独立した案件です。Cloudflare Worker名は `umekoji-potel-guest-demo`。GitHubも専用リポジトリを使い、他施設版のリポジトリ・Workerを変更しません。

`wrangler.jsonc` の `assets.directory` と `run_worker_first` を保ち、ビルドした静的画面とデモAPIを同じWorkerから配信します。認証済みのGitHub/Cloudflare接続があれば、このディレクトリを専用リポジトリへ保存し、そのリポジトリのmainとCloudflareを連携します。実際の公開URL・commitはデプロイ結果を確認してから記録します。
