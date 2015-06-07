chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
    // Hack to get domain from url.
    // http://stackoverflow.com/questions/8498592/extract-root-domain-name-from-string
    var tmp = document.createElement('a');
    tmp.href=tab.url
    console.log(tab);
    console.log(tmp.href);
    console.log(tab.url);
    console.log(tmp.hostname);
    alert(tmp.hostname);

    var request = $.ajax({
      url: 'https://www.young-castle-3686.herokuapp.com/api/organization/',
      type: 'GET',
      data: {search : tmp.hostname},
      dataType: 'json'
    });

    request.done(function(data) {
      console.log(data);
    });

    request.fail(function(jqXHR, textStatus) {
      alert(jqXHR);
      alert( 'Request failed: ' + textStatus );
    });
});
