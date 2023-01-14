set -e

git checkout master

branches=(master solution-1-e2e-basics solution-2-e2e-advanced solution-3-unit-tests-async-mock solution-4-rxjs-ngrx solution-5-component-integration-tests solution-6-component-integration-tests-fallback solution-7-visual-regression)

for branch in ${branches[*]}; do
  git checkout $branch
  git push $1 $branch
done

git checkout master
