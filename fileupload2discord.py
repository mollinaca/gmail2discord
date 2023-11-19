#!/usr/bin/env python3
import os
import sys
import requests
from dotenv import load_dotenv

load_dotenv()


def upload_image(file_path):
    bot_token = os.getenv('DOSCORD_BOT_ID_FILE_ADMIN')
    channel_id = os.getenv('DISCORD_CHANNEL_ID_FILESPACE')
    print(bot_token)
    print(channel_id)
    api_url = f'https://discord.com/api/v10/channels/{channel_id}/messages'

    headers = {
        'Authorization': f'Bot {bot_token}',
    }

    files = {
        'file': ('image.jpg', open(file_path, 'rb'), 'image/jpeg'),
    }

    response = requests.post(api_url, headers=headers, files=files)

    if response.status_code == 200:
        result = response.json()
        image_url = result['attachments'][0]['url']
        print('Posted file URL : ', image_url)
    else:
        print('Error : ', response.status_code, response.text)


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Input filepath.")
        sys.exit(1)

    file_path = sys.argv[1]
    upload_image(file_path)
