# DiscordCensorshipBot
Basic bot that blocks a configurable list of words.

By default, the bot uses included:
* en_unfiltered.txt - These are the words that are blocked.
* en_filtered.txt - These are the words that blocked ones get replaced with, dots by default.
* en_regex.txt - Example regex, also blocked by the bot if matched.

> [!WARNING]
> [node.js](https://nodejs.org/en/download/) is required for this bot to function.


to start, simply run:
```
node main.js
```
in a terminal of your choice.

## Todo:

- [x] Make sure the bot does what it's supposed to do.
- [ ] Add support for .env
- [ ] Add support for built-in slash commands

