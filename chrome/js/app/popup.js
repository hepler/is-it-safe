// MFASupport Elements
var DOCUMENATION = '#documentation';
var SMS = '#sms';
var PHONE_CALL = '#phone_call';
var EMAIL = '#email';
var HARDWARE_TOKEN = '#hardware_token';
var SOFTWARE_IMPLEMENTATION = '#software_implementation';

// EncryptionSupport Elements
var SHA_STATUS = '#sha_status';

// Organization Elements
var NAME = '#site-name'
var CATEGORY = '#category';
var WEBSITE = '#website';
var LOGO = '#logo';
// var TWITTER_HANDLE = '.twitter_handle';

chrome.tabs.query({active:true}, function(tabs) {
    var tab;
    if (tabs.length) {
        tab = tabs[0];
    } else {
        return;
    }

    // Hack to get domain from url.
    // http://stackoverflow.com/questions/8498592/extract-root-domain-name-from-string
    var tmp = document.createElement('a');
    tmp.href=tab.url

    // query the API for this site
    var request = $.ajax({
      url: 'https://young-castle-3686.herokuapp.com/api/organization/',
      type: 'GET',
      data: {search : tmp.hostname.replace('www.', '')},
      dataType: 'json'
    });

    request.done(function(data) {

        // if we do have data on the organization, fill in the fields of the
        // popup with the appropriate metrics
        if(data.length) {
            // keep track of how many saftey metrics they pass
            var metricScore = 0;

            // access the organization object returned from the API
            var organization = data[0];
            var mfaSupport = organization.mfa_support;
            var encryptionSupport = organization.encryption_support;


            // pair the div ids with their site data
            divToDataMap = [
                [SMS, mfaSupport.sms],
                [PHONE_CALL, mfaSupport.phone_call],
                [EMAIL, mfaSupport.email],
                [HARDWARE_TOKEN, mfaSupport.hardware_token],
                [SOFTWARE_IMPLEMENTATION, mfaSupport.software_implementation],
                [SHA_STATUS, encryptionSupport.sha_status]
            ];

            // iterate through the map and generate each report item
            var arrayLength = divToDataMap.length;
            for(var i = 0; i < arrayLength; i++) {
                var divName = divToDataMap[i][0];
                var dataItem = divToDataMap[i][1];
                console.log('div: ' + divName);
                console.log(dataItem);
                console.log('---');

                if(dataItem) {
                    $(divName).find('.support').addClass('fa fa-check fa-2x');
                    metricScore++;
                } else {
                    $(divName).find('.support').addClass('fa fa-ban fa-2x');
                }
            }

            // Fill in the site information
            $(NAME).html(organization.name);
            $(LOGO).attr('src', organization.logo);

            // show the header and success div, and hide the pre-loader
            $('#site-info-header').removeClass('hidden');
            $('#success').removeClass('hidden');
            $('#loading').addClass('hidden');


            // if they don't offer any MFA, add the 'tweet at them' button
            if(metricScore == 0 && organization.twitter_handle != ''){
                var tweetText =  'https://twitter.com/share?url=http%3A%2F%2Ftwofactorauth.org&amp;text=Security+is+important%2C+%40' + organization.twitter_handle +  '.+We%27d+like+it+if+you+supported+multi-factor+auth.&amp;hashtags=SupportTwoFactorAuth';
                // insert tweet text and show the twitter button
                $('#no-mfa a').attr('href', tweetText);
                $('#no-mfa').removeClass('hidden');
            }

        } else {
            // Show no site information.
            // set the org name to the URL
            var url = tmp.href;
            // remove the protocol, then remove trailing slashes
            url = url.replace(/.*?:\/\//g, "");
            url = url.replace(/\/$/, '')
            $(NAME).html(url);
            $(NAME).attr('style', 'font-size: 20px; padding-top: 12px ');
            // get the site's favicon to use as the logo
            var favicon = 'http://www.google.com/s2/favicons?domain=' + tmp.href
            $(LOGO).attr('src', favicon);

            // show the header and no-success div, and hide the pre-loader
            $('#site-info-header').removeClass('hidden');
            $('#no-success').removeClass('hidden');
            $('#loading').addClass('hidden');
        }
    });

    request.fail(function(jqXHR, textStatus) {
        // Recommend other sites.
        // Show no site data element.

    });
})

// // handle button clicks for 'learn more'
// document.addEventListener('DOMContentLoaded', function () {
//       document.querySelector('#more').addEventListener('click', openMorePage);
// });
//
//
// function openMorePage() {
//     var link = "/more.html"
//     newWindow = window.open(link, '_blank');
//     newWindow.focus();
// }
