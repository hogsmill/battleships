#!/bin/bash

FORCE=false
OUTDATED=true
while [ $1 ]
do
  if [ "$1" == "-f" ]; then
    FORCE=true
  fi
  shift
done

REPO="https://github.com/hogsmill/battleships.git"
APPS=(
  'battleships,battleships,3008'
  'battleships-new,battleshipsNew,3036'
  'battleships-guardian,battleshipsGuardian,3026,Battleships'
  'battleships-ratesetter,battleshipsRatesetter,3060,Battleships'
  'battleships-eagile,battleshipsEverydayAgile,3068,Battleships'
)

for ((i = 0; i < ${#APPS[@]}; i++))
do
  REC="${APPS[$i]}"

  APP=`echo $REC | cut -d, -f1`
  COLLECTION=`echo $REC | cut -d, -f2`
  PORT=`echo $REC | cut -d, -f3`
  APPNAME=`echo $REC | cut -d, -f4`

  echo "------------------------------------------------"
  if [ -z "$APPNAME" ]; then
    echo "Installing $APP ($COLLECTION, $PORT)"
  else
    echo "Installing $APP ($COLLECTION, $PORT, $APPNAME)"
  fi
  echo "------------------------------------------------"

  DIR="/usr/apps/$APP"
  if [ ! -d $DIR ]; then
    git clone $REPO $DIR
  fi
  ENVFILE="$DIR/.env"
  echo "VUE_APP_PORT=$PORT" > $ENVFILE
  echo "VUE_APP_COLLECTION=$COLLECTION" >> $ENVFILE
  if [ ! -z "$APPNAME" ]; then
    echo "VUE_APP_NAME=$APPNAME" >> $ENVFILE
  fi

  cd $DIR

  PWD=`pwd`
  APP=`basename $PWD`
  git stash
  GIT=`git pull`
  echo $GIT
  if [ "$FORCE" != "true" -a "$GIT" == "Already up to date." ]; then
    exit 0
  fi

  npm install --legacy-peer-deps
  npm run build
  if [ ! -d /var/www/html/$APP/ ]; then
    mkdir /var/www/html/$APP
  fi
  if [ -d /var/www/html/$APP/css ]; then
    rm /var/www/html/$APP/css/*
  else
    mkdir /var/www/html/$APP/css
  fi
  if [ -d /var/www/html/$APP/js ]; then
    rm /var/www/html/$APP/js/*
  else
    mkdir /var/www/html/$APP/js
  fi
  cp -R dist/* /var/www/html/$APP
  if [ -f "src/server.js" ]; then
    SERVER=`ps -ef | grep server.js | grep "/$APP/" | awk {'print $2'}`
    if [ "$SERVER" != "" ]; then
      kill -9 $SERVER
    fi
  fi

done

ps -ef | grep php | grep outdated
if [ $? -eq 1 ]; then
  php /usr/apps/monitor/src/lib/outdated.php &
fi
