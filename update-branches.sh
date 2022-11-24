set -e

git checkout master

declare -a branches=(
  master
  solution-1-basics-a solution-2-basics-b
  solution-3a-testing solution-3b-testing
  solution-4-1-dto solution-4-2-webtests solution-4-3-openapi-a solution-4-4-openapi-b solution-4-5-upload-download
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
    git tag -d `git tag | grep -E '.'`
    git merge $previous -m merge
  fi;
done

git checkout $branch
git merge $current $branch -m merge

git checkout master
