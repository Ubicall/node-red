# Node-RED

http://nodered.org

## what i try to do in this fork :
* add mongo db as storage engine for [flows - user -sessions ].
* create group which has some flow and each group has user may have specific permission to change / deploy a flow.
* [create customized component for ivr](https://github.com/waleedsamy/node-red-contrib-ivr).

[![Build Status](https://travis-ci.org/node-red/node-red.png)](https://travis-ci.org/node-red/node-red) [![Coverage Status](https://coveralls.io/repos/node-red/node-red/badge.png?branch=master)](https://coveralls.io/r/node-red/node-red?branch=master)


A visual tool for wiring the Internet of Things.

![Screenshot](http://nodered.org/images/node-red-screenshot.png "Node-RED: A visual tool for wiring the Internet of Things")

## Quick Start

Check out [INSTALL](INSTALL.md) for full instructions on getting started.

1. download the zip and unzip, or git clone
```
cd node-red ; git checkout ivr
npm install
# [preserve | prebuild] package app in development or production respectively
# config_version - which configuration version you like to use i.e. 20150920 - default _specified in settings.js_
# db_env - [internal | external] control db connections attributes , default *internal* which use internal_ip and internal_port to connect to DB - default _internel_
grunt preserve && db_env=external node red.js
```
Open <http://localhost:1880>
## Getting Help

More documentation can be found [here](http://nodered.org/docs).

For further help, or general discussion, please use the [mailing list](https://groups.google.com/forum/#!forum/node-red).

## Browser Support

The Node-RED editor runs in the browser. We routinely develop and test using
Chrome and Firefox. We have anecdotal evidence that it works in recent versions of IE.

We have basic support for using in mobile/tablet browsers.

## Contributing

Before raising a pull-request, please read our [contributing guide](https://github.com/node-red/node-red/blob/master/CONTRIBUTING.md).

## Authors

Node-RED is a creation of [IBM Emerging Technology](http://ibm.com/blogs/et).

* Nick O'Leary [@knolleary](http://twitter.com/knolleary)
* Dave Conway-Jones [@ceejay](http://twitter.com/ceejay)

For more open-source projects from IBM, head over [here](http://ibm.github.io).

## Copyright and license

Copyright 2013, 2015 IBM Corp. under [the Apache 2.0 license](LICENSE).
