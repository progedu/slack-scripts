# slack-scripts

### このスクリプトについて

現在このスクリプトでは、

- emailアドレスのリストから
  - パブリックチャンネルに招待する
  - パブリックチャンネルから削除する
  - プライベートチャンネルに招待する
  - プライベートチャンネルから削除する

以上の機能を提供しています。今後、要望に応じてSlack向けスクリプトを増やしていく予定です。

### 使い方

##### 1. インストール

まず、このスクリプトを GitHub よりダウンロードします。
その後、[Node.js](https://nodejs.org/ja/) をインストール (v10.16.3 LTS以上)。

コンソールにて

```
npm install
```

以上を実行。必要なライブラリをインストールします。

##### 2. スクリプトの編集

次にVSCode 等のエディタで、必要な処理のコメントアウトを取り除き、不要な処理をコメントアウトします。(コマンド+/)

```
      // パブリックチャンネル招待
      // const inviteResult = await web.channels.invite({channel : channelId, user : user.id }) as InviteResult 
      // const channel = inviteResult.channel;
      // console.log(`[INFO] email: ${email} user.name: ${user.name} channel.name: ${channel.name} の招待を行いました。`);

      // パブリックチャンネル削除
      //await web.channels.kick({channel : channelId, user : user.id }) // 削除
      //console.log(`[INFO] email: ${email} user.name: ${user.name} channelId: ${channelId} の削除を行いました。`);

      // プライベートチャンネル招待
      await web.groups.invite({channel : channelId, user : user.id });
      console.log(`[INFO] email: ${email} user.name: ${user.name} channelId: ${channelId} の招待を行いました。`);

      // プライベートチャンネル削除
      // await web.groups.kick({channel : channelId, user : user.id }) // 削除
      // console.log(`[INFO] email: ${email} user.name: ${user.name} channelId: ${channelId} の削除を行いました。`);
```

##### 3. OAuth Access Token の取得 と必要な招待

次に、 [Slack App](https://api.slack.com/apps) より

- channels:write
- groups:write
- users:read
- users:read.email

の権限を持つAppを作成し、OAuth Access Tokenを取得します。 

```
xoxp-99999999-99999999-hogehoge-fugafuga
```

以上のような形式となっています。テキストとして大事に控えておきましょう。


** もしプライベートチャンネルに案内する場合には、トークンの製作者 sifue 等を、一旦プライベートチャンネルに招待します。**

##### 4. チャンネル ID の取得

次にチャンネルの ID を取得しましょう。チャンネルのリンク

```
https://sifue.slack.com/messages/G4AK35007
```

などの `G4AK35007` がチャンネルの ID となります。

##### 5. スクリプトの実行

コンソールにて

```
env SLACK_TOKEN="xoxp-99999999-99999999-hogehoge-fugafuga" CHANNEL_ID="G4AK35007" npm start
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

のように表示され、エラーが生じた場合にもその結果を表示してくれます。

### LISENCE
ISC LICENSE