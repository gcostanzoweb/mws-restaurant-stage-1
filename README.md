# Restaurant Reviews - Stage 1
---
#### _Udacity FEWD Nanodegree Project_

## Project Overview
This project mimics a website to collect reviews of restaurants, along with the relative infos and their location on a map.
Provided with a non-responsive, non-accessible version of the website, the goal was to:
1. Make it responsive with the appropriate media queries to be good-looking on all devices
2. Add accessibility features and make sure the website is accessible with a screen reader
3. Add offline functionalities through the use of a service worker and browser cache
4. Make sure the styling for the code conforms Udacity guidelines and the README is exhaustive

### How to run this project

(guidelines taken & edited from the initial commit's README)

1. In the root folder, start up a simple HTTP server to serve up the site files on your local computer.
In a terminal, check the version of Python you have: `python -V`. If you have Python 2.x, spin up the server with `python -m SimpleHTTPServer 8000` (or some other port, if port 8000 is already in use.) For Python 3.x, you can use `python3 -m http.server 8000`. If you don't have Python installed, navigate to Python's [website](https://www.python.org/) to download and install the software.

2. With your server running, visit the site: `http://localhost:8000` to access the website's index

## Notes about Leaflet.js and Mapbox:

This repository uses [leafletjs](https://leafletjs.com/) with [Mapbox](https://www.mapbox.com/). The code uses my MapBox token for functionalities in files `js/main.js` and `js/restaurant_info.js`, be sure to switch it with your own token if you want to use this project.