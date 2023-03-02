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

echo colorText "apply changes"
git add --all

echo colorText "start commit"
git commit -m '$Message'

echo colorText "update version to package.json"
npm version $Version

echo colorText "repository publish"
git push

echo colorText "npm package publish"
npm publish

echo backgroundText "package published."