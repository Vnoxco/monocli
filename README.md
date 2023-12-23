<h1 align="center">MonoCLI</h1>
<p align="center">MonoBill's official CLI for quicker theme and app development. This command line tool comes with handy features like automatic file uploads for website themes, running your app locally for easier development.</p>
<br>
<h2>Install on Windows</h2>

Requirements
- Chocolatey (windows package manager)
- NodeJS
- PHP (if using laravel app)
- Composer (if using laravel app)
- Ngrok

Steps:
- Download and install chocolatey, follow the instructions here: https://chocolatey.org/install
- Install NodeJs from https://nodejs.org/en/download
- (if using laravel app) Install php by running choco install php
- (if using laravel app) Install composer from https://getcomposer.org/download/
- Edit php.ini and change ;extension=zip to extension=zip and ;extension=fileinfo to extension=fileinfo
- Install ngrok https://ngrok.com/download
- Install MonoCLI "npm install -g @ron-vnox/monocli"

NB -
If you are using the Laravel + Vue application, Vite will only work if you view the app from the same machine you are serving the app from. Vite runs on localhost.
