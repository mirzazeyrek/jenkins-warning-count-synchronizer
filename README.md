# README #

### IMPORTANT UPDATE ###

After the release of Next Generation Warnings plug-in of Jenkins this workaround script became redundant. Please see https://wiki.jenkins.io/display/JENKINS/Warnings+Next+Generation+Plugin and watch the introduction video https://www.youtube.com/watch?v=0GcEqML8nys.

This is a simple CasperJS script for syncing warning counts of checkstyle and pmd warnings for given two jenkins jobs.

Useful if you have two different jobs for Master and PR's of a repository.

### Example Usage ###


```
#!shell

casperjs test warning-threshold-sync.js --jenkins_url="http://yourjenkinsurl.com" --username="jenkins_user" --pass="pass" --reference_job="reference-job" --modify_job="modifiy_job"
```

Example images and shell script can be found in the repository.

### Issue Reference: ###

https://issues.jenkins-ci.org/browse/JENKINS-13056
