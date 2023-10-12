# Diazo theme for printing service


## Package structure

* **theme/** - contains the HTML theme and its assets
* **theme_helpers/** - custom python package used in the configuration file in order to override the built-in Paster#proxy service.
* **diazo.ini** - main configuration
* **rules.xml** - theming rules
* **docker-compose.yaml** - Docker orchestration file
* **Dockerfile** - Docker image
* **requirements.xml** - Python package requirements

## Local Setup

**Requirements:** Make sure your system has a full installation of **Python 3.10** or higher.

Clone this package

```shell
git clone git@github.com:lmu/diazo_myprint.git
```

Create a virtual environment

```shell
cd diazo_myprint
python3.10 -m venv venv
```

Install requirements

```shell
./venv/bin/pip install -r requirements.txt
```


Run the application

```shell
./venv/bin/paster serve --reload diazo.ini
```

The application will run on port `5000` by default. This can be configured in the `diazo.ini` file.

## Docker Setup

**Requirements:** `docker` and `docker-compose`. Newer docker versions come shipped with `compose` by default so `docker-compose` does need to be installed separately.

Clone this package

```shell
git clone git@github.com:lmu/diazo_myprint.git
```

Run the stack

```shell
docker compose up -d
```

The application will be available on port `5000` by default, this can be changed by editing the docker-compose.yaml file and updating the `ports` section (e.g. `8080:5000` to have it run on host port `8080`).

The proxy address can be specified either in `diazo.ini` or via the `APP_PROXY_ADDR` environment variable in `docker-compose.yaml`, if both are given, the `diazo.ini` value takes precedence.

## Docker Development

After following the steps in "Docker Setup", uncomment the sections `command` and `volumes` in `docker-compose.yaml`, edit `diazo.ini` and set `debug = false` in the `[filter:theme]` section then run 

```shell
docker compose up -d
```

This will mount the current folder in the container, replacing the application and any code/configuration changes will cause a reload. 

The Diazo theme will also re-build itself on each request so any changes to `rules.xml` or other theme files will be instatly visible, at the cost of response time.

### Custom domain and SSL

The Docker orchestration includes a `frontend` service which uses the official `nginx` docker image to proxy the theming service as a specific domain, with optional SSL support. 

By default the service will start with SSL disabled and bind itself to port `80` on the host. Edit the `NGINX_HOST` environment variable in `docker-compose.yaml` in order to set the server name (e.g. `NGINX_HOST=www.printservice.uni-muenchen.de`).

In order to enable SSL you need to:
* add your certificate and key to the `./nginx/certs/` folder
* uncomment `443` in the `docker-compose`:
    ```yaml
    frontend:
        ports:
        - 80:80
        - 443:443
    ```
* edit `./nginx/templates/default.conf.template` to uncomment the SSL `server` sections, and comment the first http-only section. Modify `ssl_certificate` and `ssl_certificate_key` as appropriate.
## Theme logic

The theme is based off the https://www.lmu.de/de/index.html theme, parts of it have been copied as `./theme/assets/` and `theme.html`.

The header navigation has been replaced with a custom implementation as the original lmu.de page makes use of a `json` for generating the navigation, which could not be successfully reproduced.

The *myPrint* markup makes heavy use of tables for element positioning and styling, so simple CSS based styling and mobile compatibility is not a simple endeavour.

Styling customisations are done in the `theme.css` file. The `theme.js` file contains certain customisation elements where more advanced logic was needed than was possible with a strict Diazo-based approach:

* Adding a class on the HTML `<body>` element in order to easily identify the current page via CSS: `page-{pagename}` (e.g. *page-login*, *page-clientprofile*).
* Moving the language selector in the top navigation, while maintaining functionality: the `<select>` is replaced by an `<input type="hidden">` in the page form, which is kept in sync with the select that is now outside the form.
* Moving the site actions ("Help", "Profile", etc.) in the theme header, while creating a clone of them, that is only visible on mobile. As part of moving the site actions, a fix is also implemented for the "Logout" link, which prevents the redirect outside the theme domain.
* Loading the "Hinweise", "Kosten" (`./theme/templates/${LANG}/hinweise-kosten.html`) and "Mensakarte" (`./theme/templates/${LANG}/mensa-karte.html`) sections. This is done via JS as inserting the content via `<replace href= />` rules breaks the encoding. The content could be included directly in the `./theme/theme.html` file, but having it in separate files may ease customisation.
* Loading the footer links (`./theme/templates/${LANG}/footer-links.html`) in accordance with the selected language.
* Hiding of inactive error messages on the login page: the "invalid password" and "invalid identifier" messages are invisible but still occupy a lot of vertical space, this hides them when they are not shown.
* Hiding of the install printer container on mobile, where the button is not rendered, but it's container occupies a lot of space.