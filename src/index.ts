'use strict';

import * as fs from 'fs';

// WebAPI Method について → https://api.slack.com/methods
// Slack SDK WebAPI について → https://slack.dev/node-slack-sdk/web-api
import { WebClient, WebAPICallResult } from '@slack/web-api';

// メイン処理
(async () => {
  const token = process.env.SLACK_TOKEN;
  if (!token) {
    console.log(`[ERROR] 環境変数 SLACK_TOKEN が設定されていません。`);
    return;
  }
  const channelId = process.env.CHANNEL_ID;
  if (!channelId) {
    console.log(`[ERROR] 環境変数 CHANNEL_ID が設定されていません。`);
    return;
  }

  const web = new WebClient(token);
  const emails = fs
    .readFileSync('./emails.csv')
    .toString('UTF-8')
    .split('\n');
  console.log(`[INFO] 全 ${emails.length} 件の処理を開始します。`);

  let counter = 0;
  for (const email of emails) {
    try {
      const rookupByEmailResult = (await web.users.lookupByEmail({
        email
      })) as LookupByEmailResult;
      const user = rookupByEmailResult.user;

      //////////////////////  実行したい処理のコメントアウトを外して利用して下さい //////////////////////////

      // パブリックチャンネル招待
      // const inviteResult = await web.channels.invite({channel : channelId, user : user.id }) as InviteResult
      // const channel = inviteResult.channel;
      // console.log(`[INFO] email: ${email} user.name: ${user.name} channel.name: ${channel.name} の招待を行いました。`);

      // パブリックチャンネル削除
      // await web.channels.kick({channel : channelId, user : user.id }) // 削除
      // console.log(`[INFO] email: ${email} user.name: ${user.name} channelId: ${channelId} の削除を行いました。`);

      // プライベートチャンネル招待
      await web.groups.invite({ channel: channelId, user: user.id });
      console.log(
        `[INFO] email: ${email} user.name: ${user.name} channelId: ${channelId} の招待を行いました。`
      );

      // プライベートチャンネル削除
      // await web.groups.kick({channel : channelId, user : user.id }) // 削除
      // console.log(`[INFO] email: ${email} user.name: ${user.name} channelId: ${channelId} の削除を行いました。`);

      counter++;
    } catch (err) {
      console.log(`[ERROR] APIの実行エラー email: ${email} err: ${err}`);
    }
  }

  console.log(`[INFO] 全 ${counter} 件の処理を終えました。`);
})();

interface LookupByEmailResult extends WebAPICallResult {
  user: {
    id: string;
    name: string;
  };
}

interface InviteResult extends WebAPICallResult {
  channel: {
    id: string;
    name: string;
  };
}
