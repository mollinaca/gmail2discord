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
        const webhook = sheet.getRange(rowIndex, 2).getValue();

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
                        const username = label == "dev_test" ? "dev_test bot" : null;
                        const avatar_url = labe == "dev_test" ? "https://cdn.discordapp.com/attachments/1175432721489739887/1175451785775824896/image.jpg?ex=656b47c8&is=6558d2c8&hm=85152dda481d1b9c7eead64f283ad20b2ef0229b2fdc4e08976ab8d96f6d4e8e&" : null;


                        Logger.log(subject);
                        const payload = {
                            ...(username ? { username: username } : {}),
                            ...(avatar_url ? { avatar_url: avatar_url } : {}),
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