/**
 * Created by mirzaartbees on 12.6.2017.
 */
var jenkins_url = casper.cli.get("jenkins_url");

casper.test.begin('jenkins master threshold synchronization started '+jenkins_url, 10, function suite(test) {
    var username = casper.cli.get("username");
    var pass = casper.cli.get("pass");
    var reference_job = casper.cli.get("reference_job");
    var modify_job = casper.cli.get("modify_job");
    var reference_job_build = casper.cli.get("reference_job_build");
    var last_build_url = '';
    var last_build_no;
    var checkstyle_count;
    var pmd_count;
    // go the jenkins main page.
    casper.start(jenkins_url, function() {
        test.assertTitleMatch(/Jenkins/, 'homepage title contains expected value.');
    });

    // open login page.
    casper.thenOpen(jenkins_url + "/login", function() {
        test.assertTitleMatch(/Jenkins/, 'Login page contains expected title.');
    });

    // do login and check success
    casper.waitForSelector("#j_username", function() {
        this.fillSelectors('#main-panel > div > form', {
            '#j_username' : username,
            'input[type="password"]' : pass
        }, true);
        console.log("Logging In...");
        this.click('#yui-gen1-button');
        casper.waitForSelector("#header > div.login > span > a.model-link.inside.inverse", function() {
            test.assertSelectorHasText('#header > div.login > span > a.model-link.inside.inverse', 'automation', "login is successful.");
        });

    });

    // open reference job last successful build.
    var reference_job_url = jenkins_url + "/job/" + reference_job + "/" + reference_job_build;
    console.log("reference_job_url");
    console.log(reference_job_url);
    casper.thenOpen(reference_job_url, function() {

        casper.waitForSelector("#main-panel > table > tbody > tr:nth-child(4) > td:nth-child(2) > a", function() {
            checkstyle_count = this.getHTML('a[href=checkstyleResult]');
            checkstyle_count = checkstyle_count.replace(' warnings','');
            checkstyle_count = checkstyle_count.replace(',','');
            console.log(checkstyle_count + " checkstyle_count");
            pmd_count = this.getHTML('a[href=pmdResult]');
            pmd_count = pmd_count.replace(' warnings','');
            pmd_count = pmd_count.replace(',','');
            console.log(pmd_count + " pmd_count");
        });
        var expected_title = (reference_job + ' #' + reference_job_build + ' [Jenkins]').replace(/\u200B/g,'');
        console.log("Expected Title: \'"+expected_title+"\'");
        test.assertTitle(expected_title, 'Last Build Page has expected title');
    });

        // http://ci.artbees.net:8081/job/artbees-portal-PR/configure
        var pr_configuration_url = jenkins_url + '/job/' + modify_job + '/configure';
        casper.thenOpen(pr_configuration_url, function() {
            var expected_title = modify_job+" Config [Jenkins]";
            test.assertTitle(expected_title, modify_job + ' configure page has expected title');
            casper.waitForSelector("div[descriptorid='hudson.plugins.checkstyle.CheckStylePublisher']", function() {
                var checkstyle_advanced_button_selector = "div[descriptorid='hudson.plugins.checkstyle.CheckStylePublisher'] span.yui-button.yui-push-button.advanced-button.advancedButton button";
                var checkstyle_advanced_button_text = this.getHTML(checkstyle_advanced_button_selector);
                test.assertEquals("Advanced...",checkstyle_advanced_button_text,"Checkstyle Advanced button has expected text");
                this.click(checkstyle_advanced_button_selector);
                casper.waitForSelector("form[action='configSubmit']", function() {
                    console.log("Filling Checkstyle error counts...");
                    this.fillSelectors("form[action='configSubmit']", {
                        "div[descriptorid='hudson.plugins.checkstyle.CheckStylePublisher'] input[name='healthy']" : checkstyle_count,
                        "div[descriptorid='hudson.plugins.checkstyle.CheckStylePublisher'] input[name='failedTotalAll']" : checkstyle_count,
                        "div[descriptorid='hudson.plugins.pmd.PmdPublisher'] input[name='healthy']" : pmd_count,
                        "div[descriptorid='hudson.plugins.pmd.PmdPublisher'] input[name='failedTotalAll']" : pmd_count
                    }, false);
                    this.click("span.yui-button.yui-push-button.apply-button.applyButton > span > button");
                    casper.wait(2000);
                });
            });

            casper.thenOpen(pr_configuration_url, function() {
                casper.waitForSelector("div[descriptorid='hudson.plugins.checkstyle.CheckStylePublisher']", function() {
                    var checkstyle_healhty_value = this.getElementAttribute("div[descriptorid='hudson.plugins.checkstyle.CheckStylePublisher'] input[name='healthy']", 'value');
                    test.assertEquals(checkstyle_healhty_value, checkstyle_count, "checkstyle_healhty_value has expected text");
                    var checkstyle_failedTotalAll_value = this.getElementAttribute("div[descriptorid='hudson.plugins.checkstyle.CheckStylePublisher'] input[name='failedTotalAll']", 'value');
                    test.assertEquals(checkstyle_failedTotalAll_value, checkstyle_count, "checkstyle_failedTotalAll_value has expected text");
                    var phpmd_healhty_value = this.getElementAttribute("div[descriptorid='hudson.plugins.pmd.PmdPublisher'] input[name='healthy']", 'value');
                    test.assertEquals(phpmd_healhty_value, pmd_count, "phpmd_healhty_value has expected text");
                    var phpmd_failedTotalAll_value = this.getElementAttribute("div[descriptorid='hudson.plugins.pmd.PmdPublisher'] input[name='failedTotalAll']", 'value');
                    test.assertEquals(phpmd_failedTotalAll_value, pmd_count,"phpmd_failedTotalAll_value has expected text");
                });
            });
            
        });
        
    casper.run(function() {
        test.done();
    });
    
});
