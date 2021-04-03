# slack-scripts

Slack 向けの特定のチャンネルの招待/キック(削除)を自動化するスクリプト

# 機能について

現在、このスクリプトでは、

- email アドレスのリストから
- チャンネルに招待する
- チャンネルから削除する

以上の機能を提供しています。今後、要望に応じて Slack 向けスクリプトを増やしていく予定です。なお、プライベートチャンネルの処理はアプリケーショントーク作成者をチャンネルに招待して貰う必要があります。

# 使い方

### 1. インストール

まず、このスクリプトを GitHub よりダウンロードします。
その後、[Node.js](https://nodejs.org/ja/) をインストール (v10.16.3 LTS 以上)します。
Windows の方は、Windows 用、Mac の方は Mac 用のものをインストールしてください。

コンソール(Windows の場合には PowerShell をメニューから立ち上げて)、ダウンロードして解凍したフォルダ内にて

```
cd slack-scripts
npm install
```

以上を実行。必要なライブラリをインストールします。エラーが出ないことを確認して下さい。

ここでは「プライベートチャンネル招待」するコードだけを実行するように残してあります。

### 2. OAuth Access Token の取得 と必要な招待

次に、 [Slack App](https://api.slack.com/apps) より

- channels:write
- groups:write
- im:write
- mpim:write
- users:read
- users:read.email

の権限を持つ App を作成し、OAuth Access Token を取得します。
Permissionのところから上記のスコープを(BotトークンではなくUserトークン)作成し、ワークスペースにインストールしてトークンを発行します。

```
xoxp-99999999-99999999-hogehoge-fugafuga
```

以上のような形式となっています。テキストとして大事に控えておきましょう。
あらかじめそのような Apps が作成されている場合には、その App の管理者にトークンをもらいましょう。

**なお、もしプライベートチャンネルに案内する場合には、トークンの製作者 sifue 等を、一旦プライベートチャンネルに招待する必要があります。**

### 3. チャンネル ID の取得

次にチャンネルの ID を取得しましょう。チャンネルのリンクをコピーして得られる、

```
https://sifue.slack.com/messages/G4AK35007
```

などの URL のパスの最後、ここでは `G4AK35007` がチャンネルの ID となります。

### 4. スクリプトの実行

コンソールにて、OAuth Access Token とチャンネル ID を置き換えて、実行モード(EXEC_MODE)を指定します。

実行モードは

- チャンネル招待: `conv-invite`
- チャンネルから削除: `conv-kick`

以上を参考に設定できます。

```
env SLACK_TOKEN="xoxp-99999999-99999999-hogehoge-fugafuga" EXEC_MODE="conv-invite" CHANNEL_ID="G4AK35007" npm start
```

Windows の PowerShell の場合には、

```
& { $env:SLACK_TOKEN="xoxp-99999999-99999999-hogehoge-fugafuga";  $env:EXEC_MODE="conv-invite"; $env:CHANNEL_ID="G4AK35007"; npm start }
```

以上を実行すると

```
[INFO] 全 4 件の処理を開始します。
[INFO] email: hogefuga1@nnn.ac.jp user.name: teacher_d_draagon channelId: G4AK35007 の招待を行いました。
[ERROR] APIの実行エラー email: hogefuga2@nnn.ed.jp err: Error: An API error occurred: cant_invite_self
[ERROR] APIの実行エラー email: hogefuga3@nnn.ac.jp err: Error: An API error occurred: users_not_found
[ERROR] APIの実行エラー email: hogefuga4@nnn.ac.jp err: Error: An API error occurred: users_not_found
[INFO] 全 1 件の処理を終えました。
```

のように表示され実行されます。エラーが生じた場合にもその結果を表示してくれます。エラーが生じても成功するものは実行されます。

### 5. その他の環境変数オプション

- `EMAILS_FILE` をファイルのパスにすることで異なる `./emails.csv` 以外の E メールを設定している CSV ファイルを指定することができます。

# LISENCE

ISC LICENSE
