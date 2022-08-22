![alt text](https://github.com/kaustubhshukla30/webActivity/blob/main/icon16.png)
# Web Activity Tracker 

This a chrome extension that monitors and summerizes the user's web activity. The purpose of this extension is to self analyze one's web usage and increase productivity by greylisting/blacklisting the websites that user finds unproductive.

## Today's Usage

Displays the list of websites visited in the last 24 hours along with the time spent on each of them. The time of the currect focused webpage time is also displayed as a badge on the icon of the extension.
A pie chart showing the time statistics is displayed above the list.

## All Time Usage page

Similar to "Today's Usage", but displays data collected accross all time of universe.

## Options

- Blacklisting of websites: The user may add a website to the blacklist with a certain time limit (defaults to 0). When the time limit of the website goes below 1 minute, the extension icon badge turns red and displays a countdown of 60 secs. After this time is exhausted the website gets blocked. If said website is removed from blacklist the blocked page redirects back to the website.

- Daily reset: By default the today's usage data is reset at 4:20AM, however the user can manually set this time.

- Reset: The user can reset the total collected data for today, or all time.
