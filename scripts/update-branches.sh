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
current=

for branch in ${branches[*]}; do
  previous=$current
  current=$next
  next=$branch

  if [ ! $current = "" ]
  then
    git checkout $current
    git tag -d `git tag | grep -E '.'`
    git merge $previous -m merge
  fi;
done

git checkout $branch
git merge $current $branch -m merge

git checkout $mainBranch
