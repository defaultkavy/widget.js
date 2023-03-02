#!/bin/bash
set -e

echo package Version: 
read Version

echo commit message:
read Message

echo apply changes
git add --all

echo start commit
git commit -m '$Message'

echo update version to package.json
npm version $Version

echo repository publish
git push

echo npm package publish
npm publish

echo package published.