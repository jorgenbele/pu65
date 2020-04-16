
# Table of Contents

1.  [Description](#org6220648)
2.  [Frontend](#org43c79a4)
    1.  [Requirements](#org2d4dc7f)
    2.  [Development setup](#org493d66b)
        1.  [Install required JS packages using yarn](#org60d7773)
        2.  [Configuration (URL of backend server, etc.)](#org09edd52)
        3.  [Running the frontend development server using expo](#org249a735)
        4.  [Code formatting (StandardJS)](#org63d6d7a)
        5.  [Testing](#org9221b81)
        6.  [Building and publishing](#org381b429)
    3.  [Releases](#org115fa2e)
        1.  [Expo Store](#orgb75f772)
        2.  [Android](#orgc9a4cd2)
        3.  [iOS](#org81d2618)
        4.  [Other releases](#orgd3a721b)
    4.  [Troubleshooting](#org5d16724)
        1.  [The app doesn&rsquo;t work, I can&rsquo;t login, create user etc..](#orgac6baa5)
        2.  [I don&rsquo;t have expo/yarn etc.](#orgcd0c66c)
3.  [Backend](#orgb68a888)
    1.  [Requirements](#orgf6995b0)
    2.  [Development setup](#org4f6f481)
        1.  [Setup Python virtual environment using pipenv](#orgdfeb400)
        2.  [Entering the virtual environment using pipenv](#orgab15dc8)
        3.  [Using django](#org0dbda7b)
    3.  [Deployment](#org37bde64)
        1.  [Gitlab CI/CD variables](#org03235f6)
    4.  [Troubleshooting](#org9f0aee8)
        1.  [Did you make changes to the database models and you now get inconsistencies or errors?](#org0a259cf)
4.  [LICENSE](#org88e9be0)



<a id="org6220648"></a>

# Description

An Expo app for shopping lists


<a id="org43c79a4"></a>

# Frontend



<a id="org2d4dc7f"></a>

## Requirements

-   yarn (tested on version 1.2.4)
-   expo (tested on version 3.13.6), see dev. setup


<a id="org493d66b"></a>

## Development setup


<a id="org60d7773"></a>

### Install required JS packages using yarn

In order to run the development server the javascript packages and build tools
used have to be installed. These are installed using the following command:

    # make sure you are in frontend/ when running these commands
    yarn install


<a id="org09edd52"></a>

### Configuration (URL of backend server, etc.)

Modify the `BASE_URL` constant in `frontend/src/constants/Urls.js` to be the URL of the
backend server. It will point to the staging backend server by default.
No other configuration should be needed.


<a id="org249a735"></a>

### Running the frontend development server using expo

To start the development server just run the following command and follow
the instructions it will print out. It will guide you to running the debug
application on your mobile phone with live reload and other useful functionality.

    # make sure you are in frontend/ when running these commands
    expo start


<a id="org63d6d7a"></a>

### Code formatting (StandardJS)

StandardJS is used for code formatting/linting. Run it using the following command.

    yarn run standard # runs frontend/node_modules/.bin/standard


<a id="org9221b81"></a>

### Testing

Running the test suite is as easy as executing the following command:

    yarn test


<a id="org381b429"></a>

### Building and publishing

1.  Setting up app metadata: app.json

    Modify `frontend/app.json` to set metadata such as the privacy, app name, app
    icon, android package, ios details etc.

2.  Publishing to Expo Store

    Publishing to the Expo Store is an easy way to make the app easily accessable
    for other users and is as simple as running one command. One can publish to
    multiple channels such that one can have one published version of the app for
    each branch, for example.
    
    First of all you will need an expo account and must login to this account using
    the expo cli. See expo docs <sup><a id="fnr.1" class="footref" href="#fn.1">1</a></sup> for instructions.
    
        expo publish # --release-channel <channel> to set release channel

3.  Building for Android (APK)

    Building for Android is trivial using expo&rsquo;s building servers.
    
        expo build:android
    
    This command will build the APK on expo&rsquo;s servers without any need for setting
    up android studio etc. After the build is completed its possible to download the
    .apk file and publish it wherever desired.

4.  Building for iOS

    Building for iOS requires more setup because Apple requires that a developer
    account is used. Since we don&rsquo;t have such an account this has not been done, but
    see the expo docs <sup><a id="fnr.1.100" class="footref" href="#fn.1">1</a></sup> for further information.
    
        expo build:ios

5.  (Semi-)Automation of builds

    1.  Using Git hooks
    
        This is the easiest way of semi-automatically building releases. Just add the
        above publish procedure to .git/hooks/<your desired hook> and it will be
        executed when the desired hook is run.
    
    2.  Using Gitlab CI/CD
    
        Another way to do it. Must have a docker image (or alternative) with expo-cli
        installed and login to expo before calling `expo publich --release-channel
        <branch_name>`. This is prefered, but is not setup currently.


<a id="org115fa2e"></a>

## Releases


<a id="orgb75f772"></a>

### Expo Store

Use the latest published expo store version from: [@jbele/shopstop](https://expo.io/@jbele/shopstop)

Scan the QR code using the expo app on Android, and the camera
app on iOS to launch the app on a mobile phone.


<a id="orgc9a4cd2"></a>

### Android

Get the latest release here: [`shopstop_latest.apk`](https://gitlab.stud.idi.ntnu.no/tdt4140-2020/65/-/raw/build/builds/shopstop_latest.apk)


<a id="org81d2618"></a>

### iOS

Not available due to lack of an apple developer account. Use the expo store and
the expo app to run it instead.


<a id="orgd3a721b"></a>

### Other releases

Check the tagged commits for releases including links to specific versions.


<a id="org5d16724"></a>

## Troubleshooting


<a id="orgac6baa5"></a>

### The app doesn&rsquo;t work, I can&rsquo;t login, create user etc..

The backend server is probably not setup correctly. See Backend README for instructions.


<a id="orgcd0c66c"></a>

### I don&rsquo;t have expo/yarn etc.

Google &rsquo;how to install expo&rsquo; and &rsquo;how to install yarn respectively.


<a id="orgb68a888"></a>

# Backend



<a id="orgf6995b0"></a>

## Requirements

-   Python 3.8
-   Pip
-   Pipenv (installed by running: pip install pipenv)


<a id="org4f6f481"></a>

## Development setup


<a id="orgdfeb400"></a>

### Setup Python virtual environment using pipenv

    # make sure you are in backend/ when running these commands
    pipenv install # this will install all the python packages needed for this project


<a id="orgab15dc8"></a>

### Entering the virtual environment using pipenv

    # make sure you are in backend/ when running these commands
    pipenv shell

All further instructions assume that you are are in a pipenv shell


<a id="org0dbda7b"></a>

### Using django

1.  Starting the development server

    The server will automatically reload when any changes are detected. If database
    models are changed however (`models.py`), see Troubleshooting below.
    
        python manage.py runserver

2.  Running development server for use within the frontend app

    To be able to use the development server from the app one has to bind to an IP
    and port that is accessible by the mobile device that the frontend app will run
    on.
    
    Add the IP to the list of `ALLOWED_HOSTS` in `app/settings.py`, and run the
    server, providing the ip and port.
    
        python manage.py runserver <IP:PORT>
    
    Then, modify the `BASE_URL` in the frontend, as described in the configuration
    section of the Frontend README to point to this IP with that port.


<a id="org37bde64"></a>

## Deployment


<a id="org03235f6"></a>

### Gitlab CI/CD variables

The following Gitlab CI/CD variables have to be setup properly:

-   `SECRET_HEROKU_API_KEY`: the api key for heroku &#x2013; used to deploy backend to
    staging and production.


<a id="org9f0aee8"></a>

## Troubleshooting


<a id="org0a259cf"></a>

### Did you make changes to the database models and you now get inconsistencies or errors?

Run the following commands to update the database to match the models.
Remember to commit the files created when this command is run, when changes to
the django models has been made.

First, stop the server if it is running, then execute the following commands,
and restart the server again.

    # in backend/ and in pipenv shell environment
    python manage.py makemigrations
    python manage.py migrate


<a id="org88e9be0"></a>

# LICENSE

MIT License

Copyright (c) 2020 NTNU Software Development Group 65

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the &ldquo;Software&rdquo;), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED &ldquo;AS IS&rdquo;, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.


# Footnotes

<sup><a id="fn.1" href="#fnr.1">1</a></sup> Expo documentation is found at <https://docs.expo.io/versions/latest/>
