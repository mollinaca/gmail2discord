#!/usr/bin/env python3
import os
from dotenv import load_dotenv
import discord
from discord.ext import commands

load_dotenv()

bot_token = os.getenv('DISCORD_BOT_ID')
channel_id = os.getenv('DISCORD_CHANNEL_ID_GENERAL')


# BOTのプレフィックス（コマンドの先頭につける文字）を設定
bot_prefix = "!"

# Intentsを設定
# intents = discord.Intents.default()
intents = discord.Intents.all()
intents.messages = True
intents.guilds = True
intents.message_content = True


# BOTを作成
bot = commands.Bot(command_prefix=bot_prefix, intents=intents)


# BOTが起動した際に実行されるイベント
@bot.event
async def on_ready():
    print(f'{bot.user.name} has connected to Discord!')


# チャンネル一覧を取得するコマンド
@bot.command(name='list_channels', help='List all channels in the server')
async def list_channels(ctx):
    # サーバー内のすべてのチャンネルを取得
    channels = ctx.guild.channels

    # チャンネル一覧を取得したメッセージを送信
    await ctx.send(f'サーバー内のチャンネル一覧：\n`\n{channels}\n`')


# メッセージをチャンネルに投稿するコマンド
@bot.command(name='post_message', help='Post a message to a channel')
async def post_message(ctx, channel_id, *, message):
    # 指定されたチャンネルIDでチャンネルを取得
    channel = discord.utils.get(ctx.guild.channels, id=channel_id)

    if channel:
        # メッセージを指定されたチャンネルに送信
        await channel.send(message)
        await ctx.send(f'Message posted in <#{channel.id}>!')
    else:
        await ctx.send(f'Channel with ID {channel_id} not found.')


# BOTのトークンを設定して実行
bot.run(bot_token)
