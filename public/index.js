
function addNewEntry(event) {
  if(event.code == "Enter"){
    var entryText = document.getElementsByClassName('entry')[0];
    var entryTextValue = entryText.value;
    entryText.value = "";
    responseValue = "";
    for(var i = 0; i < entryTextValue.length; i++){
      responseValue += entryTextValue[entryTextValue.length-i-1];
    }

    var log = document.getElementsByClassName('chatlog')[0];
    log.value += entryTextValue + "\n";
    log.value += responseValue + "\n";
    log.scrollTop = log.scrollHeight;

  }
}

// Wait until the DOM content is loaded to hook up UI interactions, etc.
window.addEventListener('DOMContentLoaded', function (event) {
  var log = document.getElementsByClassName('chatlog')[0];
  log.value = "";

  var addNoteButtonElem = document.getElementsByClassName('entry');
  addNoteButtonElem[0].addEventListener('keyup', addNewEntry);

});
