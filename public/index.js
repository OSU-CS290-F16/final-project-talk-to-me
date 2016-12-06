
var lastline = "";

function addNewEntry(event) {
  console.log(event.code);
  if(event.code == "Enter"){

    var entryText = document.getElementsByClassName('entry')[0];
    var entryTextValue = entryText.value;
    var postUrl = '/sendingstrings';
    var postRequest = new XMLHttpRequest();
    postRequest.open('POST', postUrl);
    postRequest.setRequestHeader('Content-Type', 'application/json');
    postRequest.addEventListener('load', function (event) {
      console.log("inside");
      responseValue = event.target.response;
      var log = document.getElementsByClassName('chatlog')[0];
      lastline = responseValue;
      log.value += entryTextValue + "\n";
      log.value += responseValue + "\n";
      log.scrollTop = log.scrollHeight;
    });
    console.log("inside");
    postRequest.send(JSON.stringify({
    line: lastline,
    response: entryTextValue
  }));
  }
}

// Wait until the DOM content is loaded to hook up UI interactions, etc.
window.addEventListener('DOMContentLoaded', function (event) {
  var log = document.getElementsByClassName('chatlog')[0];
  log.value = "";

  var addNoteButtonElem = document.getElementsByClassName('entry');
  addNoteButtonElem[0].addEventListener('keyup', addNewEntry);

});
