set -e

git checkout main

branches=(
  main
  solution-1-1-basics solution-1-2-advanced
  solution-2-1-basics solution-2-2-advanced
  solution-3-1-basics solution-3-2-openapi
  solution-3-3-upload-download-1-basic solution-3-3-upload-download-2-download solution-3-3-upload-download-3-misc
  solution-4-data-1-h2 solution-4-data-2-entity solution-4-data-3-testing solution-4-data-4-relations solution-4-data-5-mysql-flyway solution-4-data-6-data-test-containers
  solution-5-modulith solution-5-archunit
  solution-5-microservices-1-brochure-status solution-5-microservices-2-web-client solution-5-microservices-3-feign solution-5-microservices-4-amqp
)

for branch in ${branches[*]}; do
  git checkout $branch
  git push $1 $branch
done

git checkout main
