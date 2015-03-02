# fnc-seed
This is an empty fncJS based Web app. You can use it to quickly bootstrap your application.
Since fncJS does not dictate the structure of your application, you can use this application as a seed for any Web application project.

It provides a skeleton to create a Web app using Web Components.

## Getting Started
Clone the fnc-seed repository using git:

```
git clone https://github.com/itinora/fnc-seed.git
cd fnc-seed
```

### Install npm and gulp tools

Install npm to get bower and gulp dependencies

```
cd dev
npm install
```

This will

1. create folder `node_modules` that contains all tools to run gulp tasks

2. create folder `bower_components` that contains all client side dependencies by running <code>gulp bower</code> as postinstall command


### Run application

```
gulp
```

This will do the following:
- Process all JS files
- Process all SCSS files
- Process index.html file to point to the right JS and CSS locations
- Deploy all web server files under folder `deploy`
- Run the web server and open the url in a browser (default: chrome. You can change the browser in gulpfile.js)
- Watch HTML, JS and SCSS files for any change. On change, rerun the above steps and refresh the browser page using BrowserSync

### To deploy on Production

```
gulp --prod
```

This will create minified versions of all js and css files ideal for a prod deploy
