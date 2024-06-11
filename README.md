<h1 align="center"><img width="28px" src="https://assets.gomonobill.com/monobill/command_line.png"> MonoCLI</h1>
<p align="center">MonoBill's official CLI for theme and app development. This command line tool comes with handy features like automatic file uploads for website themes, running your app locally for easier development.</p>
<h2>Table of contents</h2>
<p>
  <a href="#install-on-windows">Install on Windows</a><br>
  <a href="#install-on-mac">Install on Mac</a><br>
  <a href="#commands">Commands</a>
</p>
<br>
<h2>Install on Windows</h2>

Requirements
- Chocolatey
- NodeJS
- PHP (if creating an app using laravel)
- Composer (if creating an app using laravel)
- Ngrok (if creating an app)

Steps:
<ol>
  <li>Download and install chocolatey, follow the instructions here: https://chocolatey.org/install</li>
  <li>Install NodeJs from https://nodejs.org/en/download</li>
  <li>Install ngrok https://ngrok.com/download</li>
  <li>(if using Laravel app) Install php by running <code>choco install php</code></li>
  <li>(if using Laravel app) Install composer from https://getcomposer.org/download/</li>
  <li>(if using Laravel app) Edit php.ini and change <code>;extension=zip</code> to <code>extension=zip</code> and <code>;extension=fileinfo</code> to <code>extension=fileinfo</code></li>
  <li>Install MonoCLI <code>npm install -g @ron-vnox/monocli</code></li>
</ol>

<h2>Install on Mac</h2>

Requirements
- Homebrew
- NodeJS
- PHP (if creating an app using laravel)
- Composer (if creating an app using laravel)
- Ngrok (if creating an app)

Steps:
<ol>
  <li>Download and install Homebrew <code>/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"</code></li>
  <li>Install NodeJs <code>brew install node</code></li>
  <li>Install ngrok https://ngrok.com/download</li>
  <li>(if using Laravel app) Install php by running <code>brew install php</code></li>
  <li>(if using Laravel app) Install composer by running <code>brew install composer</code></li>
  <li>(if using Laravel app) Edit php.ini and change <code>;extension=zip</code> to <code>extension=zip</code> and <code>;extension=fileinfo</code> to <code>extension=fileinfo</code></li>
  <li>Install MonoCLI <code>npm install -g @ron-vnox/monocli</code></li>
</ol>

<hr>
NB -
If you are using the Laravel + Vue application, Vite will only work if you view the app from the same machine you are serving the app from. Vite runs on localhost.
<hr>

<h2>Commands</h2>
<a href="#mono-auth-login"><code>mono auth login</code></a><br>
<a href="#mono-auth-logout"><code>mono auth logout</code></a><br>
<a href="#mono-auth-who"><code>mono auth who</code></a><br>
<br>
<a href="#mono-theme-download-id"><code>mono theme download [id]</code></a><br>
<a href="#mono-theme-list"><code>mono theme list</code></a><br>
<a href="#mono-theme-open"><code>mono theme open</code></a><br>
<a href="#mono-theme-upload"><code>mono theme upload</code></a><br>
<a href="#mono-theme-watch"><code>mono theme watch</code></a><br>
<br>
<a href="#mono-app-init-dir"><code>mono app init [dir]</code></a><br>
<a href="#mono-app-serve"><code>mono app serve</code></a><br>
<br>
<a href="#mono-store-list"><code>mono store list</code></a><br>

<h2><code>mono auth login</code></h2>

```
USAGE
  mono auth login

DESCRIPTION
  Login using your MonoBill account.
```

<h2><code>mono auth logout</code></h2>

```
USAGE
  mono auth logout

DESCRIPTION
  Logout of your current session and delete the access token.
```

<h2><code>mono auth who</code></h2>

```
USAGE
  mono auth who

DESCRIPTION
  Shows which MonoBill account is currently authenticated.
```

<h2><code>mono theme download [id]</code></h2>

```
USAGE
  mono theme download [id]

DESCRIPTION
  Download a theme by ID.
  If the working directory is a MonoBill theme and the config file is present, the ID is not required.
```

<h2><code>mono theme list</code></h2>

```
USAGE
  mono theme list

DESCRIPTION
  Download a theme by ID.
  List all themes on your MonoBill account, development themes and themes installed on stores.

```

<h2><code>mono theme open</code></h2>

```
USAGE
  mono theme open

DESCRIPTION
  Open the theme in preview mode

```

<h2><code>mono theme upload</code></h2>

```
USAGE
  mono theme upload

DESCRIPTION
  Uploads all files in the current theme directory.

OPTIONS:
      --id       ID of the theme to upload                              [number]
  -s, --store    Store ID for upload                                    [string]
```

<h2><code>mono theme watch</code></h2>

```
USAGE
  mono theme watch

DESCRIPTION
  Watch directory for file changes and upload file automatically.

OPTIONS:
  -f, --force    Force the command to execute                          [boolean]
```

<h2><code>mono app init [dir]</code></h2>

```
USAGE
  mono app init [dir]

DESCRIPTION
  Initialize an app, downloading the latest example app from GitHub and setting the basic configurations.

OPTIONS:
  --type     Type of application, [laravel-vue]                     [string] [default: "laravel-vue"]
  --dir      Directory of which the app should be initialized       [string]
  -f, --force    Force the command to execute                       [boolean]

```

<h2><code>mono app serve</code></h2>

```
USAGE
  mono app serve

DESCRIPTION
  Start development processes and open a tunnel

OPTIONS:
  --tunnel      Specify the tunnel software to use. [ngrok]           [string] [default: "ngrok"]
  --tunnel-url  Specify the url that the tunnel should run on.        [string] [required]
  --app-port    Specify the port that the app should run on locally.  [number] [default: 8001]

```

<h2><code>mono store list</code></h2>

```
USAGE
  mono store list

DESCRIPTION
  List all stores on your MonoBil account, development stores and live stores.

```
