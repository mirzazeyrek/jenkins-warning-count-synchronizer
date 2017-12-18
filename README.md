# README #

This is a simple CasperJS script for syncing warning counts of checkstyle and pmd warnings for given two jenkins jobs.

Useful if you have two different jobs for Master and PR's of a repository.

### Example Usage ###


```
#!shell

casperjs test warning-threshold-sync.js --jenkins_url="http://yourjenkinsurl.com" --username="jenkins_user" --pass="pass" --reference_job="reference-job" --modify_job="modifiy_job"
```


### Issue Reference: ###

https://issues.jenkins-ci.org/browse/JENKINS-13056
