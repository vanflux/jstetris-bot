# JSTris Bot

<p align="center">
  <image src="public/icon128.png"></image>
</p>

![](https://img.shields.io/github/v/release/vanflux/jstetris-bot)
![](https://img.shields.io/github/actions/workflow/status/vanflux/jstetris-bot/node.js.yml?branch=main)

Integration of [tetris-ai](https://github.com/vanflux/tetris-ai) with JSTris website.

*Don't play on LIVE matches. I'm not responsible by your actions and consequences! You will be banned!*

Play only on practice mode(only you) or with a friend who KNOWS you are using bot.

Based on [web-game-hacking-boilerplate](https://github.com/vanflux/web-game-hacking-boilerplate.git).

# Usage

## Chrome

- Download latest release `jstris-bot-chrome.zip`
- Unzip to some location on your PC
- Go to url `chrome://extensions`
- Enable development mode
- Load the uncompressed extension and pick the unzipped directory

## Firefox

- Download latest release `jstris-bot-firefox.zip`
- Go to url `about:debugging`
- Go to `This Firefox`
- Load temporary add-ons and pick the .zip

# Development

## Setup + Run

- Clone repo
- Install dependencies: `npm i`
- Run `npm start <chrome|firefox>`

## Chrome

- Go to url `chrome://extensions`
- Enable development mode
- Load the uncompressed extension and pick the `build/dev` directory inside project dir
- If you want the extension hot-reloading working properly open the extension console(`service worker`) and keep it opened on background.

## Firefox

- Go to url `about:debugging`
- Go to `This Firefox`
- Load temporary add-ons and pick the `build/dev` directory inside project dir

# Demo

<p align="center">
  <image src="gifs/demo1.gif"></image>
</p>
