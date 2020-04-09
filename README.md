
# Table of Contents

1.  [Description](#org533928f)
2.  [Frontend](#org08b2165)
    1.  [Requirements](#org2802410)
    2.  [Development setup](#orge399efc)
        1.  [Install required JS packages using yarn](#orgcc24ce0)
        2.  [Configuration (URL of backend server, etc.)](#orga0dfc7a)
        3.  [Running the frontend development server using expo](#orgaeacd1b)
        4.  [Code formatting (StandardJS)](#org03fa137)
        5.  [Testing](#org8d3e343)
        6.  [Building and publishing](#org6b9ed77)
    3.  [Releases](#orgc5675ea)
        1.  [Expo Store](#orgad7da75)
        2.  [Android](#org3ac5ccd)
        3.  [iOS](#org9485569)
        4.  [Other releases](#org960139a)
    4.  [Troubleshooting](#org878ae75)
        1.  [The app doesn&rsquo;t work, I can&rsquo;t login, create user etc..](#org3dacb29)
        2.  [I don&rsquo;t have expo/yarn etc.](#org43b3ca4)
3.  [Backend](#org31daf29)
    1.  [Requirements](#org7219035)
    2.  [Development setup](#org0ceee00)
        1.  [Setup Python virtual environment using pipenv](#org9c80f28)
        2.  [Entering the virtual environment using pipenv](#orgda00a7e)
        3.  [Using django](#orgf381cdd)
    3.  [Deployment](#org36604dc)
        1.  [Gitlab CI/CD variables](#orgd93f44e)
    4.  [Troubleshooting](#org08a2789)
        1.  [Did you make changes to the database models and you now get inconsistencies or errors?](#org424321e)



<a id="org533928f"></a>

# Description

An Expo app for shopping lists


<a id="org08b2165"></a>

# Frontend



<a id="org2802410"></a>

## Requirements

-   yarn (tested on version 1.2.4)
-   expo (tested on version 3.13.6), see dev. setup


<a id="orge399efc"></a>

## Development setup


<a id="orgcc24ce0"></a>

### Install required JS packages using yarn

In order to run the development server the javascript packages and build tools
used have to be installed. These are installed using the following command:

    # make sure you are in frontend/ when running these commands
    yarn install


<a id="orga0dfc7a"></a>

### Configuration (URL of backend server, etc.)

Modify the `BASE_URL` constant in `frontend/src/constants/Urls.js` to be the URL of the
backend server. It will point to the staging backend server by default.
No other configuration should be needed.


<a id="orgaeacd1b"></a>

### Running the frontend development server using expo

To start the development server just run the following command and follow
the instructions it will print out. It will guide you to running the debug
application on your mobile phone with live reload and other useful functionality.

    # make sure you are in frontend/ when running these commands
    expo start


<a id="org03fa137"></a>

### Code formatting (StandardJS)

StandardJS is used for code formatting/linting. Run it using the following command.

    yarn run standard # runs frontend/node_modules/.bin/standard


<a id="org8d3e343"></a>

### Testing

Running the test suite is as easy as executing the following command:

    yarn test


<a id="org6b9ed77"></a>

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


<a id="orgc5675ea"></a>

## Releases


<a id="orgad7da75"></a>

### Expo Store

Use the latest published expo store version from: [@jbele/shopstop](https://expo.io/@jbele/shopstop)

Scan the QR code using the expo app on Android, and the camera
app on iOS to launch the app on a mobile phone.


<a id="org3ac5ccd"></a>

### Android

Get the latest release here: [`shopstop_latest.apk`](https://gitlab.stud.idi.ntnu.no/tdt4140-2020/65/-/raw/build/builds/shopstop_latest.apk)


<a id="org9485569"></a>

### iOS

Not available due to lack of an apple developer account. Use the expo store and
the expo app to run it instead.


<a id="org960139a"></a>

### Other releases

Check the tagged commits for releases including links to specific versions.


<a id="org878ae75"></a>

## Troubleshooting


<a id="org3dacb29"></a>

### The app doesn&rsquo;t work, I can&rsquo;t login, create user etc..

The backend server is probably not setup correctly. See Backend README for instructions.


<a id="org43b3ca4"></a>

### I don&rsquo;t have expo/yarn etc.

Google &rsquo;how to install expo&rsquo; and &rsquo;how to install yarn respectively.


<a id="org31daf29"></a>

# Backend



<a id="org7219035"></a>

## Requirements

-   Python 3.8
-   Pip
-   Pipenv (installed by running: pip install pipenv)


<a id="org0ceee00"></a>

## Development setup


<a id="org9c80f28"></a>

### Setup Python virtual environment using pipenv

    # make sure you are in backend/ when running these commands
    pipenv install # this will install all the python packages needed for this project


<a id="orgda00a7e"></a>

### Entering the virtual environment using pipenv

    # make sure you are in backend/ when running these commands
    pipenv shell

All further instructions assume that you are are in a pipenv shell


<a id="orgf381cdd"></a>

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


<a id="org36604dc"></a>

## Deployment


<a id="orgd93f44e"></a>

### Gitlab CI/CD variables

The following Gitlab CI/CD variables have to be setup properly:

-   `SECRET_HEROKU_API_KEY`: the api key for heroku &#x2013; used to deploy backend to
    staging and production.


<a id="org08a2789"></a>

## Troubleshooting


<a id="org424321e"></a>

### Did you make changes to the database models and you now get inconsistencies or errors?

Run the following commands to update the database to match the models.
Remember to commit the files created when this command is run, when changes to
the django models has been made.

First, stop the server if it is running, then execute the following commands,
and restart the server again.

    # in backend/ and in pipenv shell environment
    python manage.py makemigrations
    python manage.py migrate


# Footnotes

<sup><a id="fn.1" href="#fnr.1">1</a></sup> Expo documentation is found at <https://docs.expo.io/versions/latest/>
