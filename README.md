Install on Windows

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