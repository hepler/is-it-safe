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

var currentSite;


// Set variable of the site currently being checked
self.port.on('currentSite', function (data) {
    currentSite = data;
});


// Handle the site report info passed in from index.js
self.port.on('siteReportData', function (data) {

    // If there is data on the organization, fill in the fields of the
    // popup with the appropriate metrics
    if(data.length) {
        // Keep track of how many saftey metrics they pass
        var metricScore = 0;

        // Access the organization object returned from the API
        var organization = data[0];
        var mfaSupport = organization.mfa_support;
        var encryptionSupport = organization.encryption_support;

        // Pair the div ids with their site data
        divToDataMap = [
            [SMS, mfaSupport.sms],
            [PHONE_CALL, mfaSupport.phone_call],
            [EMAIL, mfaSupport.email],
            [HARDWARE_TOKEN, mfaSupport.hardware_token],
            [SOFTWARE_IMPLEMENTATION, mfaSupport.software_implementation],
            [SHA_STATUS, encryptionSupport.sha_status]
        ];

        // Iterate through div-to-data map and generate each report item
        var arrayLength = divToDataMap.length;
        for(var i = 0; i < arrayLength; i++) {
            var divName = divToDataMap[i][0];
            var dataItem = divToDataMap[i][1];

            // If affirmative, add the check mark and increase metricScore
            if(dataItem) {
                $(divName).find('.support').addClass('fa fa-check fa-2x');
                if(divName != SHA_STATUS) metricScore++;
            } else {
                $(divName).find('.support').addClass('fa fa-ban fa-2x');
            }
        }

        // Fill in the site information
        $(NAME).html(organization.name);
        $(LOGO).attr('src', organization.logo);

        // Show the header and success div, and hide the pre-loader
        $('#site-info-header').removeClass('hidden');
        $('#success').removeClass('hidden');
        $('#loading').addClass('hidden');
        $('#no-success').addClass('hidden');

        // If they don't offer any MFA, add the 'tweet at them' button
        if(metricScore == 0 && organization.twitter_handle != ''){
            var tweetText = 'https://twitter.com/share?url=' + 'http%3A%2F%2Ftwofactorauth.org&amp;text=Security+is+' +
            'important%2C+%40' + organization.twitter_handle +  '.+We%27d+like+it+if+you+supported+multi-factor+auth.&amp;' + 'hashtags=SupportTwoFactorAuth';

            // insert tweet text and show the twitter button
            $('#no-mfa a').attr('href', tweetText);
            $('#no-mfa').removeClass('hidden');
            // make the panel a little bigger
            self.port.emit('extendPanelHeight');
        }

    // If we do not have this organization, then show the
    // div to allow user to add the org to our list
    } else {
        // Use the URL as the org's name in the html header
        $(NAME).html(currentSite);
        $(NAME).attr('style', 'font-size: 20px; padding-top: 12px ');

        // Get the site's favicon to use as the logo
        var favicon = 'http://www.google.com/s2/favicons?domain=' + currentSite;
        $(LOGO).attr('src', favicon);

        // Show the header and no-success div, and hide the pre-loader
        $('#loading').addClass('hidden');
        $('#site-info-header').removeClass('hidden');
        $('#no-data').removeClass('hidden');
        $('#no-success').removeClass('hidden');
    }
}); // end of self.port here


// reset the panel every time the extension button is clicked
self.port.on('resetPanel', function() {
    $('#site-info-header').addClass('hidden');
    $('#success').addClass('hidden');
    $('#no-mfa').addClass('hidden');

    $('#no-success').addClass('hidden');
    $('#no-data').addClass('hidden');
    $('#submitted').addClass('hidden');

    $('#loading').removeClass('hidden');

    self.port.emit('createNewPanel');
});


// Add a click event listener to the 'add site' button
$(function() {
    $('#add-site').on('click', addSite());
});


// If the site does not exist, allow the user to submit an 'add site' request
function addSite() {
    self.port.emit('newSiteRequest');
}


// After the site request has been sent, display the 'thank you' message
self.port.on('sentSiteRequest', function() {
    $('#no-data').addClass('hidden');
    $('#submitted').removeClass('hidden');
});
