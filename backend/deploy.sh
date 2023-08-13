#!/bin/bash

git pull
docker rm --force serpinit-container
docker build -t serpinit-webserver/main:latest .