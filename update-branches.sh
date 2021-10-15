set -e

git checkout master

branches=(master 01-unit-tests-basic 02-unit-tests-advanced 03-rxjs-marbles 04-ngrx 05-comp-tests-basic 06-comp-tests-advanced 07-integration-tests 08-e2e-tests-basic 09-e2e-tests-advanced)
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
