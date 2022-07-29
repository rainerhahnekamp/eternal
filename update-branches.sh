set -e

git checkout master

branches=(master solution-01-unit-tests-async-mock solution-02a-unit-tests-rxjs solution-02b-unit-tests-ngrx solution-03-component-integration-tests-basic solution-04-component-integration-tests-advanced solution-05-e2e-tests-basic solution-06-e2e-tests-advanced solution-07-beyond-e2e)
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
