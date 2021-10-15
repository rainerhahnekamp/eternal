set -e

git  checkout master

branches=(master 01-unit-tests-basic 02-unit-tests-advanced 03-rxjs-marbles 04-ngrx 05-comp-tests-basic 06-comp-tests-advanced 07-integration-tests 08-e2e-tests-basic 09-e2e-tests-advanced)

for branch in ${branches[*]}; do
  git checkout $branch
  git push -u origin HEAD
done

git checkout master
