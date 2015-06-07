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
var NAME = '#name'
var CATEGORY = '#category';
var WEBSITE = '#website';
var LOGO = '#logo';
var TWITTER_HANDLE = '.twitter_handle';


chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
    // Hack to get domain from url.
    // http://stackoverflow.com/questions/8498592/extract-root-domain-name-from-string
    var tmp = document.createElement('a');
    tmp.href=tab.url

    var request = $.ajax({
      url: 'https://young-castle-3686.herokuapp.com/api/organization/',
      type: 'GET',
      data: {search : tmp.hostname.replace('www.', '')},
      dataType: 'json'
    });

    request.done(function(data) {
        if(data.length) {

            var organization = data[0];
            var mfaSupport = organization.mfa_support;
            var encryptionSupport = organization.encryption_support;

            console.log(organization);
            console.log(mfaSupport);
            console.log(encryptionSupport);

            // Fill two factor auth support
            $(DOCUMENATION)
            $(SMS)
            $(PHONE_CALL)
            $(EMAIL)
            $(HARDWARE_TOKEN)
            $(SOFTWARE_IMPLEMENTATION)

            // Fill sha information
            $(SHA_STATUS)

            // Fill site information
            $(NAME)
            $(CATEGORY)
            $(WEBSITE)
            $(LOGO)
            $(TWITTER_HANDLE)

        } else {
            // Show no site information.
        }
    });

    request.fail(function(jqXHR, textStatus) {
        // Recommend other sites.
        // Show no site data element.
    });
});
