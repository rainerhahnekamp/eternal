set -e

git  checkout 01-setup

branches=(01-setup 02-unit-tests-a 03-unit-tests-b 04-unit-tests-rxjs 05-comp-tests 06-comp-tests-material 07-comp-tests-harnesses 08-ngrx-tests 09-visual-regression 10-storybook 11-e2e-basic)
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

git checkout 01-setup
