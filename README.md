# Vitalik's Secret

<p align="center">
  <a href="https://vitalik-secret.vercel.app">
    <img src="docs/public/screenshot32x32.png" alt="Vitalik's Secret Logo" width="500">
  </a>
</p>

Explanation Video: https://www.youtube.com/watch?v=4GjPklxDX3Q

A world scale puzzle that challenge anyone to find the best solution. It is a NP-hard problem so rife for exploration

## What is it ?

This project is a world-scale puzzle that lets anyone try to solve it in the minimum moves. Even as creators, we don't have any more clues. A fully permissionless puzzle
The person with the best solution gets the prize.

While the project is made with a fun twist, the puzzle is itself an interesting challenge. There are many research papers on the topic and rewarding research with NFT could be an interesting application to this kind of research.

## How it works ?

Proving that you played game correctly presents the challenge of itself. You can prove only limited number of moves in naive Solidity implementation.
We brielfy considered going with optimistic approach which removes computation cost but had other drawbacks, but we knew we had to stay true to the Vitalik's secret and leverage power of zk moon math.
We used Noir to write game circut in which solver plays the moves and generates proof of number moves needed to finish the game.
When you verify the proof in smart contract that surpasses best score, unique NFT is minted to you as reward.
During your rein as best solver it features special effect.

Technologies used:

- [Noir](https://noir-lang.org/) for snark circuits
- [Solidity](https://soliditylang.org/) for smart contract code
- DAPP is build with power of [Jolly Roger ☠️](https://jolly-roger.eth.limo) stack
- [Viem](https://viem.sh/) is used for network communication

## How to use?

We are assuming here that you already setup your env as specified in the [initial setup section](#initial-setup)

### install dependencies

Note here that while you can use `pnpm i`, we recommend you follow the instruction here so you can have everything setup with your own project's name.

```bash
pnpm boot
```

This will set the app name to the folder nane or the name you provide (and change the files to reflect that) and then call `pnpm i`

You can also manually set the name yourself :

```bash
pnpm set-name [<new name>] && pnpm i
```

### start!

Then Assuming you have [zellij](https://zellij.dev/) installed

```bash
pnpm start
```

**And you are ready to go!**

Note that if you do not have [zellij](https://zellij.dev/) (on windows for example) you can use [wezterm](https://wezfurlong.org/wezterm/index.html)

```bash
pnpm start:wezterm
```

Or you can also launch each component in their own process

```bash
pnpm local_node
```

```bash
pnpm contracts:compile:watch
```

```bash
pnpm contracts:deploy:watch
```

```bash
pnpm common:dev
```

```bash
pnpm indexer:dev
```

```bash
pnpm web:dev
```

## Deploying to a network

Just execute the following

```bash
pnpm contracts:deploy:prepare <network>
```

and it will ask you few questions and get your .env.local setup with the var needed to deploy on the network of your choice.

You just need to have a endpoint url and mnemonic ready for it.

You can of course configure it manually with more option if you need

Then you can deploy your contract

```bash
pnpm contracts:deploy <network>
```

## Initial Setup

You need to have these installed

- [nodejs](https://nodejs.org/en)

- [pnpm](https://pnpm.io/)

  ```bash
  npm i -g pnpm
  ```

Then you need to install the local dependencies with the following command:

```bash
pnpm i
```

We also recommend to install [zellij](https://zellij.dev/) to have your dev env setup in one go via `pnpm start`
