set -e

git checkout main

branches=(
  main
  solution-01-e2e-basics
  starter-02-e2e-advanced solution-02-e2e-advanced
  starter-03-unit-tests-async-mock solution-03-unit-tests-async-mock
  starter-04-rxjs solution-04-rxjs
  starter-05-component-integration-tests solution-05-component-integration-tests
  starter-06-component-integration-tests-fallback solution-06-component-integration-tests-fallback
  starter-07-visual-regression solution-07-visual-regression
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

git checkout main
