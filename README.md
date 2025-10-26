# Letterbox Common

A CLI tool to find and compare common films in the watchlists of two Letterboxd users.

## Overview

Letterbox Common fetches the watchlists from two Letterboxd users and displays all films that appear on both watchlists in a formatted table. This is useful for discovering movies you and a friend both want to watch.

## Installation

1. Clone or download this repository
2. Install dependencies:

   ```bash
   npm install
   ```

## Usage

Run the tool:

```bash
npm run start
```

When prompted, enter two Letterboxd usernames separated by a comma:

```
Enter users separated with comma: username1, username2
```

The tool will:

1. Validate that both users exist
2. Fetch their watchlists (paginating through all pages)
3. Find common films
4. Display results in a formatted table with film names and links

## Example Output

```
                                            Common
┌───────────────────────────────────┬─────────────────────────────────────────────────────────┐
│                             Name  │ Link                                                    │
├───────────────────────────────────┼─────────────────────────────────────────────────────────┤
│             The Wrong Man (1956)  │ https://letterboxd.com/film/the-wrong-man/              │
│        You Only Live Once (1937)  │ https://letterboxd.com/film/you-only-live-once/         │
│             Boiling Point (2021)  │ https://letterboxd.com/film/boiling-point-2021/         │
│                   Monster (2004)  │ https://letterboxd.com/film/monster-2004/               │
│    Breakfast at Tiffany's (1961)  │ https://letterboxd.com/film/breakfast-at-tiffanys/      │
│                Twin Peaks (1989)  │ https://letterboxd.com/film/twin-peaks/                 │
│        Ghost in the Shell (1995)  │ https://letterboxd.com/film/ghost-in-the-shell/         │
│             Roman Holiday (1953)  │ https://letterboxd.com/film/roman-holiday/              │
│          The Wizard of Oz (1939)  │ https://letterboxd.com/film/the-wizard-of-oz-1939/      │
│          The Conversation (1974)  │ https://letterboxd.com/film/the-conversation/           │
│           Cinema Paradiso (1988)  │ https://letterboxd.com/film/cinema-paradiso/            │
│                Past Lives (2023)  │ https://letterboxd.com/film/past-lives/                 │
│                     Tenet (2020)  │ https://letterboxd.com/film/tenet/                      │
│                 Chinatown (1974)  │ https://letterboxd.com/film/chinatown/                  │
│             Beautiful Boy (2018)  │ https://letterboxd.com/film/beautiful-boy-2018/         │
│                   Boyhood (2014)  │ https://letterboxd.com/film/boyhood/                    │
│ The Umbrellas of Cherbourg (1964) │ https://letterboxd.com/film/the-umbrellas-of-cherbourg/ │
│      In the Mood for Love (2000)  │ https://letterboxd.com/film/in-the-mood-for-love/       │
│         The Piano Teacher (2001)  │ https://letterboxd.com/film/the-piano-teacher/          │
│                        8½ (1963)  │ https://letterboxd.com/film/8-half/                     │
└───────────────────────────────────┴─────────────────────────────────────────────────────────┘
```
