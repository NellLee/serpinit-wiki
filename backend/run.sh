#!/bin/bash

last_pid=$(cat run-lastPID.txt)
echo "kill last process if existent (PID: $last_pid)"
kill -9 "$last_pid"
nohup docker run --name serpinit-container -p 80:3000 serpinit-webserver/main:latest > deploy-run.log 2>&1 &
echo $! > run-lastPID.txt
new_pid=$(cat run-lastPID.txt)
echo "started process (PID: $new_pid)"