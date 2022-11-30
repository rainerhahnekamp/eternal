set -e

git checkout master

branches=(master solution-1-e2e-basics solution-2-e2e-advanced solution-3-unit-tests-async-mock solution-4-rxjs-ngrx solution-5-component-integration-tests solution-6-component-integration-tests-fallback solution-7-visual-regression)
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
