set -e

git checkout main

branches=(
  main
  solution-01-e2e-basics
  starter-02-e2e-advanced solution-02-e2e-advanced
  starter-03-component-integration-testssolution-03-component-integration-tests
  starter-04-unit-tests-async-mock solution-04-unit-tests-async-mock solution-04-unit-tests-async-mock-inject
  starter-05-rxjs solution-05-rxjs
  starter-06-component-integration-tests-fallback solution-06-component-integration-tests-fallback
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
