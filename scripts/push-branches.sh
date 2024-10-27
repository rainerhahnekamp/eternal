#!/bin/bash
set -e

i=0
while read line
do
  branches[$i]="workshop/testing/cypress/$line"
  i=$((i+1))
done < scripts/branches.txt

mainBranch=${branches[0]}
git checkout $mainBranch

for branch in ${branches[*]}; do
    git checkout $branch
    git push $1 $branch
done

git checkout $mainBranch

