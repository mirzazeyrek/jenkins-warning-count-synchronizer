#!/bin/bash
source /root/.profile
nvm use v7.1
phantomjs --version || npm install -g phantomjs || exit 1;
casperjs --version || npm install -g casperjs || exit 1;
rm -rf jenkins
rm -rf jenkins-sync.xml
git clone https://github.com/mirzazeyrek/jenkins-warning-count-synchronizer.git
timeout 15s casperjs test jenkins/warning-threshold-sync.js --jenkins_url="${JENKINS_URL}" --username="${USERNAME}" --pass="${PASS}" --reference_job="${REFERENCE_JOB}" --reference_job_build="${REFERENCE_JOB_BUILD}" --modify_job="${MODIFY_JOB}" --xunit=jenkins-sync.xml || timeout 10s casperjs test jenkins/warning-threshold-sync.js --jenkins_url="${jenkins_url}" --username="${username}" --pass="${pass}" --reference_job="${reference_job}" --reference_job_build="${REFERENCE_JOB_BUILD}" --modify_job="${modify_job}" --xunit=jenkins-sync.xml || exit 1