set -e

git checkout 01-setup
git merge master -m "merge from master"

git checkout 02-unit-tests-a
git merge 01-setup -m "merge from 01-setup"

git checkout 03-unit-tests-b
git merge 02-unit-tests-a -m "merge from 02-unit-tests-a"

git checkout 04-comp-tests
git merge 03-unit-tests-b -m "merge from 03-unit-tests-b"

git checkout 05-ngrx-tests
git merge 04-comp-tests -m "merge from 04-compt-tests"

git checkout 06-visual-regression
git merge 05-ngrx-tests -m "merge from 05-ngrx-tests"

git checkout 07-e2e
git merge 06-visual-regression -m "merge from 06-visual-regression"

git checkout master
