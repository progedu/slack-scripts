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
  const emailsFile = process.env.EMAILS_FILE || './emails.csv';
  const execMode = process.env.EXEC_MODE || 'public-invite';
  const web = new WebClient(token);
  const emails = fs
    .readFileSync(emailsFile)
    .toString('UTF-8')
    .split('\n');

  /**
   * wait関数
   * @param ms 待つミリ秒
   * @returns
   */
  function delay(ms: number) {
    return new Promise(resolve => {
      return setTimeout(resolve, ms);
    });
  }
  const sendWaitTime = process.env.SEND_WAIT_TIME || '500';

  console.log(`[INFO] 全 ${emails.length} 件の処理を開始します。`);
  let counter = 0;
  for (const email of emails) {
    try {
      const rookupByEmailResult = (await web.users.lookupByEmail({
        email
      })) as LookupByEmailResult;
      const user = rookupByEmailResult.user;
      if (execMode === 'public-invite') {
        // パブリックチャンネル招待
        const inviteResult = (await web.channels.invite({
          channel: channelId,
          user: user.id
        })) as InviteResult;
        const channel = inviteResult.channel;
        console.log(
          `[INFO] email: ${email} user.name: ${user.name} channel.name: ${channel.name} の招待を行いました。`
        );
      } else if (execMode === 'public-kick') {
        // パブリックチャンネル削除
        await web.channels.kick({ channel: channelId, user: user.id }); // 削除
        console.log(
          `[INFO] email: ${email} user.name: ${user.name} channelId: ${channelId} の削除を行いました。`
        );
      } else if (execMode === 'private-invite') {
        // プライベートチャンネル招待
        await web.groups.invite({ channel: channelId, user: user.id });
        console.log(
          `[INFO] email: ${email} user.name: ${user.name} channelId: ${channelId} の招待を行いました。`
        );
      } else if (execMode === 'private-kick') {
        // プライベートチャンネル削除
        await web.groups.kick({ channel: channelId, user: user.id }); // 削除
        console.log(
          `[INFO] email: ${email} user.name: ${user.name} channelId: ${channelId} の削除を行いました。`
        );
      } else if (execMode === 'conv-invite') {
        // パブリックチャンネルから変更したプライベートチャンネル招待
        await web.conversations.invite({ channel: channelId, users: user.id });
        console.log(
          `[INFO] email: ${email} user.name: ${user.name} channelId: ${channelId} の招待を行いました。`
        );
      } else if (execMode === 'conv-kick') {
        // パブリックチャンネルから変更したプライベートチャンネル削除
        await web.conversations.kick({ channel: channelId, user: user.id }); // 削除
        console.log(
          `[INFO] email: ${email} user.name: ${user.name} channelId: ${channelId} の削除を行いました。`
        );
      } else {
        console.log(
          `[ERROR] execMode: ${execMode} は対応していない実行モードです。`
        );
      }
      counter++;
    } catch (err) {
      console.log(`[ERROR] APIの実行エラー email: ${email} err: ${err}`);
    }

    delay(parseInt(sendWaitTime)); // ループの終わりに待ち時間を入れる
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
