#!/bin/sh

echo '📦 - Installing NPM packages'
yarn --cwd client

echo '⚙️  - Building React frontend'
yarn --cwd client build

echo 'React frontend ready'
