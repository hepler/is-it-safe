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

});

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

    console.log(tab);
    console.log(tmp.href);

    var request = $.ajax({
      url: 'https://young-castle-3686.herokuapp.com/api/organization/',
      type: 'GET',
      data: {search : tmp.hostname.replace('www.', '')},
      dataType: 'json'
    });

    request.done(function(data) {
        console.log(data);
        console.log(data);
        if(data.length) {
            console.log('Has Data')
            var organization = data[0];
            var mfaSupport = organization.mfa_support;
            var encryptionSupport = organization.encryption_support;

            console.log(organization);
            console.log(mfaSupport);
            console.log(encryptionSupport);

            if(mfaSupport.sms) {
                $(SMS).find('.support').addClass('fa fa-check');
            } else {
                $(SMS).find('.support').addClass('fa fa-ban');
            }

            if(mfaSupport.phone_call) {
                $(PHONE_CALL).find('.support').addClass('fa fa-check');;
            } else {
                $(PHONE_CALL).find('.support').addClass('fa fa-ban');
            }

            if(mfaSupport.email) {
                $(EMAIL).find('.support').addClass('fa fa-check');;
            } else {
                $(EMAIL).find('.support').addClass('fa fa-ban');
            }

            if(mfaSupport.hardware_token) {
                $(HARDWARE_TOKEN).find('.support').addClass('fa fa-check');;
            } else {
                $(HARDWARE_TOKEN).find('.support').addClass('fa fa-ban');
            }

            if(mfaSupport.software_implementation) {
                $(SOFTWARE_IMPLEMENTATION).find('.support').addClass('fa fa-check');;
            } else {
                $(SOFTWARE_IMPLEMENTATION).find('.support').addClass('fa fa-ban');
            }




            // Fill sha information
            if(encryptionSupport.sha_status) {
                $(SHA_STATUS).find('.support').addClass('fa fa-check');;
            } else {
                $(SHA_STATUS).find('.support').addClass('fa fa-ban');
            }

            // Fill site information
            $(NAME).html(organization.name);
            $(LOGO).attr('src', organization.logo);

        } else {
            // Show no site information.
            console.log('No Data');
        }
    });

    request.fail(function(jqXHR, textStatus) {
        // Recommend other sites.
        // Show no site data element.
    });
})
