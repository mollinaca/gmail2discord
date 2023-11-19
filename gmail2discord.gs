function hook() {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = spreadsheet.getActiveSheet();

    let rowIndex = 1;

    while (true) {
        // ラベルを取得
        const label = sheet.getRange(rowIndex, 1).getValue();
        Logger.log('Label : ' + label);


        // ラベルがなければ終了
        if (!label) {
            Logger.log('end : ラベルがありません');
            break;
        }

        // Webhook URLを取得
        const webhook = sheet.getRange(rowIndex + 1, 1).getValue();
        Logger.log('webhook : ' + webhook)

        // Gmail検索
        const threads = GmailApp.search('is:unread ' + label);

        if (threads.length > 0) {
            threads.forEach(function (thread) {
                const messages = thread.getMessages();

                const payloads = messages.map(function (message) {
                    if (message.isUnread()) {
                        message.markRead();

                        const from = message.getFrom();
                        const subject = message.getSubject();
                        const plainBody = message.getPlainBody();
                        const username = sheet.getRange(rowIndex + 1, 2).getValue();
                        Logger.log('username : ' + username)
                        const avatar_url = sheet.getRange(rowIndex + 1, 3).getValue();
                        Logger.log('avatar_url : ' + avatar_url)


                        Logger.log(subject);
                        const payload = {
                            username: username,
                            avatar_url: avatar_url,
                            content: subject,
                            embeds: [{
                                title: subject,
                                author: {
                                    name: from,
                                },
                                description: plainBody.substr(0, 2048),
                            }],
                        };

                        return {
                            url: webhook,
                            contentType: 'application/json',
                            payload: JSON.stringify(payload),
                        }
                    }
                    return null;
                }).filter(Boolean);

                Logger.log(payloads);
                UrlFetchApp.fetchAll(payloads);
            });
        } else {
            Logger.log('新規メッセージなし');
        }

        rowIndex += 2;
    }
}