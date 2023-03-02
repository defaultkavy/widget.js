#!/bin/bash
set -e

echo Package Version: 
read Version
echo Update version to package.json
npm version $Version

echo Apply changes
git add --all

echo Commit message:
read Message
git commit -m '$Message'

echo Apply tag to commit
git tag v$Version

echo Repository publish
git push

echo NPM package publish
npm publish

echo Package published.