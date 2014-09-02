#!/bin/bash

cd ./daux.io
php ./generate.php ./global.json ./static
cd ../
cp ./daux.io/static/* ./ -rf
rm -r ./daux.io//static