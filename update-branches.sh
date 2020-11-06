set -e

git checkout 01-setup
git merge master

git checkout 02-unit-tests-a
git merge 01-setup

git checkout 03-unit-tests-b
git merge 02-unit-tests-a

git checkout 04-comp-tests
git merge 03-unit-tests-b

git checkout 05-visual-regression
git merge 04-comp-tests

git checkout 06-e2e
git merge 05-visual-regression

git checkout master
