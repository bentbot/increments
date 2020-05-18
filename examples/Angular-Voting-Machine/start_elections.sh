#!/bin/bash

NAME="index.js" # nodejs script's name here
RUN=`pgrep -f $NAME`

if [ "$RUN" == "" ]; then
  # /opt/cpanel/ea-nodejs10/bin/>node ./index.js
  node ./index.js
else
  echo "Script is running"
fi