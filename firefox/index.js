var { ToggleButton } = require('sdk/ui/button/toggle');
var panels = require('sdk/panel');
var self = require('sdk/self');

const tabs = require('sdk/tabs');

var PANEL_WIDTH = 313;
var PANEL_HEIGHT_LARGE = 485;
var PANEL_HEIGHT_SMALL = 290;

var getRequestURLBase = 'https://young-castle-3686.herokuapp.com/' +
                        'api/organization/?format=json&search='

// The button displayed in the browser
var button = ToggleButton({
    id: 'open-panel',
    label: 'Is It Safe?',
    icon: {
        '16': './img/logo-16.png',
        '48': './img/logo-48.png',
        '64': './img/logo-64.png'
    },
    onChange: handleChange
});

// Create the panel to display the site report info
var panel = panels.Panel({
    contentURL: self.data.url('index.html'),
    contentScriptFile: [self.data.url('./js/jquery/jquery.min.js'), self.data.url('./js/panelContentScript.js')],
    onHide: handleHide
});


// When the button is clicked and the panel is not showing, start the
// sequence of events for a site report. First, the panel is reset. After the
// panel is reset, the createNewPanel event below is triggered.
function handleChange(state) {
    if (state.checked) {
        panel.resize(PANEL_WIDTH, PANEL_HEIGHT_SMALL);
        panel.port.emit('resetPanel');
    }
}


// Run a new site request and create the panel to display the site report data
panel.port.on('createNewPanel', function() {
    let url = tabs.activeTab.url;

    // remove the protocol and www
    var removeURLProtocol = url.substr(url.indexOf('://')+3);
    var currentSite = removeURLProtocol.replace('www.', '');
    // remove the trailing slash
    if(currentSite.substr(-1) === '/') {
        currentSite = currentSite.substr(0, currentSite.length - 1);
    }

    var fullGetRequestURL = getRequestURLBase + currentSite;

    // Create the new GET request
    var Request = require('sdk/request').Request;
    var siteInfo = Request({
        url: fullGetRequestURL,
        onComplete: function(response) {
            // Pass the URL and site report to the content script
            panel.port.emit('currentSite', currentSite);
            panel.port.emit('siteReportData', response.json);
            panel.resize(PANEL_WIDTH, PANEL_HEIGHT_LARGE);
        }
    });

    // Send the request and show the panel
    siteInfo.get();
    panel.show({
        position: button
    });
});


// Create and send a new site request after the button click.
panel.port.on('newSiteRequest', function (siteRequest) {
    var Request = require('sdk/request').Request;
    var addSiteRequest = Request({
        url: 'https://young-castle-3686.herokuapp.com/add_site/',
        content: {'site': tabs.activeTab.url},
        onComplete: function (response) {
            // Inform the content script to display the "sent" message
            panel.port.emit('sentSiteRequest');
            panel.resize(PANEL_WIDTH, PANEL_HEIGHT_SMALL);
        }
    });
    
    addSiteRequest.post();
});


// Handle extension button clicks to hide the panel
function handleHide() {
    button.state('window', {checked: false});
}
