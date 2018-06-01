#!/bin/bash
echo "Script executed from: ${PWD}"

BASEDIR=$(dirname $0)
echo "Script location: ${BASEDIR}"


KILLP="sudo pkill -9 node"
CMD="sudo node ${BASEDIR}/src/main.js -sp=scan -prod  --iface=wlan0 --loggerTime=300000"

echo "[INFO] KILLING NodeJs Process..."
$KILLP
sleep 2

$CMD