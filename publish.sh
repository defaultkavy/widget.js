#!/bin/bash
set -e

echo_ColorText () {
    echo -e "\e[36m$1\e[0m"
}
echo_BackgroundText () {
    echo -e "\e[1;46m$1\e[0m"
}

echo package version: 
read Version

echo commit message:
read Message

echo_ColorText "apply changes"
git add --all

echo_ColorText "start commit"
git commit -m '$Message'

echo_ColorText "update version to package.json"
npm version $Version

echo_ColorText "repository publish"
git push

echo_ColorText "npm package publish"
npm publish

echo_BackgroundText "package published."