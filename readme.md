# AutoSched

AutoSched is a automation tool built specifically for Cashier Managers and Assistant Cashier Managers that work in a specific retail chain. This tool is designed to replace cobbled together "Dailies" by taking the same 15min charts used for the dailies and automating the break scheduling, and cart shift scheduling normaly done by said associates.

_This tool is unofficial, and as such is not supported by the retail chain, it is merely made by me to simplify my work, and to remove two hours of work I normally would have to do every week_

## Features

- Generates a more usable Daily
- Generates a cart schedule
- Email whitelist
- Employee Customization
  - Lunch Breaks
  - Cart Schedule White/Black list
  - Nicknames

## Example In/Output

**[TODO]**

## Usage

#### Simple

For users who are not super technical and don't mind forgoing much of the customization, I have setup a modified version of this tool to watch autoafem@gmail.com

- Download your 15 min Chart
  - On the page used to priint your chart press save instead
- Email that file to autoafem@gmail.com
- An email with your finished daily will be emailed to you within 15 mins

The subject line is used for optional arguments, separate these with a space

##### Example

`cart15 nolunch`

##### Options

| Option  | Result                                   |
| ------- | ---------------------------------------- |
| cart15  | Gurantees a 15-min cart schedule is made |
| cart30  | Gurantees a 30-min cart schedule is made |
| nolunch | Removes the lunch spot from the schedule |
| nolist  | Removes the default closing checklist    |

#### Advanced

For users who are technically inclined the tool offers a lot of customization. It requires you understand how to run a node application and how to setup a cron job or looping scrip to do so, alternativly you could just run this tool everytime you wanted to run it.

**[TODO]**
