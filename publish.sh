#!/bin/bash
set -e

colorText () {
    echo -e "\e[36m$1\e[0m"
}
backgroundText () {
    echo -e "\e[46m$1\e[0m"
}

echo package version: 
read Version

echo commit message:
read Message

colorText "apply changes"
git add --all

colorText "start commit"
git commit -m '$Message'

colorText "update version to package.json"
npm version $Version

colorText "repository publish"
git push

colorText "npm package publish"
npm publish

backgroundText "package published."