set -e

git  checkout 01-setup

branches=(01-setup 02-unit-tests-a 03-unit-tests-b 03-unit-tests-rxjs 04-comp-tests 04-comp-tests-material 04-comp-tests-harnesses 05-ngrx-tests 06-visual-regression 07-storybook 08-e2e)

for branch in ${branches[*]}; do
  git checkout $branch
  git push -u origin HEAD
done

git checkout 01-setup
