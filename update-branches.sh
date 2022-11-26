set -e

git checkout master

declare -a branches=(
  master
  solution-1-basics-a solution-2-basics-b
  solution-3a-testing solution-3b-testing
  solution-4-1-basics solution-4-2-openapi
  solution-4-3-upload-download-1-basic solution-4-3-upload-download-2-download
  solution-5-data
)

previous=
current=

for branch in ${branches[*]}; do
  previous=$current
  current=$next
  next=$branch

  if [ ! $current = "" ]
  then
    git checkout $current
    git pull
    git tag -d `git tag | grep -E '.'`
    git merge $previous -m merge
  fi;
done

git checkout $branch
git merge $current $branch -m merge

git checkout master
