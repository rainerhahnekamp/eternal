#!/bin/bash
set -e

i=0
while read line
do
  branches[$i]="$line"
  i=$((i+1))
done < scripts/branches.txt

mainBranch=${branches[0]}

git checkout $mainBranch

previous=
current=$mainBranch

for branch in ${branches[*]}; do
  previous=$current
  current=$branch

  echo $current

  if [ ! $current = $mainBranch ]
  then
    git checkout $current
    git merge $previous -m "chore: merge"
  fi;
done

git checkout $mainBranch
