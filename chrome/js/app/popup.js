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
var TWITTER_HANDLE = '.twitter_handle';

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
                $(SMS).find('.support').addClass('fa fa-check fa-2x green');
            } else {
                $(SMS).find('.support').addClass('fa fa-ban fa-2x red');
            }

            if(mfaSupport.phone_call) {
                $(PHONE_CALL).find('.support').addClass('fa fa-check fa-2x green');
            } else {
                $(PHONE_CALL).find('.support').addClass('fa fa-ban fa-2x red');
            }

            if(mfaSupport.email) {
                $(EMAIL).find('.support').addClass('fa fa-check fa-2x green');
            } else {
                $(EMAIL).find('.support').addClass('fa fa-ban fa-2x red');
            }

            if(mfaSupport.hardware_token) {
                $(HARDWARE_TOKEN).find('.support').addClass('fa fa-check fa-2x green');
            } else {
                $(HARDWARE_TOKEN).find('.support').addClass('fa fa-ban fa-2x red');
            }

            if(mfaSupport.software_implementation) {
                $(SOFTWARE_IMPLEMENTATION).find('.support').addClass('fa fa-check fa-2x green');
            } else {
                $(SOFTWARE_IMPLEMENTATION).find('.support').addClass('fa fa-ban fa-2x red');
            }

            // Fill sha information
            if(encryptionSupport.sha_status) {
                $(SHA_STATUS).find('.support').addClass('fa fa-check fa-2x green');
            } else {
                $(SHA_STATUS).find('.support').addClass('fa fa-ban fa-2x red');
            }

            // Fill site information
            $(NAME).html(organization.name);
            $(LOGO).attr('src', organization.logo);

            $('#site-info-header').removeClass('hidden');
            $('#success').removeClass('hidden');
            $('#loading').addClass('hidden');

        } else {
            // Show no site information.
            console.log('No Data');
            // set the org name to the URL
            $(NAME).html(tmp.href);
            // get the site's favicon to use as the logo
            var favicon = 'http://www.google.com/s2/favicons?domain=' + tmp.href
            console.log(favicon);
            $(LOGO).attr('src', favicon);

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

document.addEventListener('DOMContentLoaded', function () {
      document.querySelector('#more').addEventListener('click', openMorePage);
});

function openMorePage() {
    var link = "/more.html"
    newWindow = window.open(link, '_blank');
    newWindow.focus();
}

//
// myApp.service('pageInfoService', function() {
//     this.getInfo = function(callback) {
//         var model = {};
//
//         chrome.tabs.query({'active': true},
//         function (tabs) {
//             if (tabs.length > 0)
//             {
//                 model.title = tabs[0].title;
//                 model.url = tabs[0].url;
//
//                 chrome.tabs.sendMessage(tabs[0].id, { 'action': 'PageInfo' }, function (response) {
//                     model.pageInfos = response;
//                     callback(model);
//                 });
//             }
//
//         });
//     };
// });
//
// myApp.controller("PageController", function ($scope, pageInfoService) {
//     $scope.SMS = sms;
//
//     pageInfoService.getInfo(function (info) {
//         $scope.title = info.title;
//         $scope.url = info.url;
//         $scope.pageInfos = info.pageInfos;
//
//         $scope.$apply();
//     });
// });
