var messages = {
  "start": {
    msg: 'Click on the record button and ask for the parts you wish to search in Inventory.',
    class: 'alert-success'},
  "speak_now": {
    msg: 'Speak now.',
    class: 'alert-success'},
  "no_speech": {
    msg: 'No speech was detected. You may need to adjust your <a href="//support.google.com/chrome/answer/2693767" target="_blank">microphone settings</a>.',
    class: 'alert-danger'},
  "no_microphone": {
    msg: 'No microphone was found. Ensure that a microphone is installed and that <a href="//support.google.com/chrome/answer/2693767" target="_blank">microphone settings</a> are configured correctly.',
    class: 'alert-danger'},
  "allow": {
    msg: 'Click the "Allow" button above to enable your microphone.',
    class: 'alert-warning'},
  "denied": {
    msg: 'Permission to use microphone was denied.',
    class: 'alert-danger'},
  "blocked": {
    msg: 'Permission to use microphone is blocked. To change, go to chrome://settings/content/microphone',
    class: 'alert-danger'},
  "upgrade": {
    msg: 'Web Speech API is not supported by this browser. It is only supported by <a href="//www.google.com/chrome">Chrome</a> version 25 or later on desktop and Android mobile.',
    class: 'alert-danger'},
  "stop": {
      msg: 'Stop listening, click on the microphone icon to restart',
      class: 'alert-success'},
  "copy": {
    msg: 'Text sent sucessfully.',
    class: 'alert-success'},
}

let final_transcript = '';
let recognizing = false;
let ignore_onend;
let start_timestamp;
let recognition;
let finalresponse='';
let finalres=''

$( document ).ready(function() {
  for (let i = 0; i < langs.length; i++) {
    select_language.options[i] = new Option(langs[i][0], i);
  }
  select_language.selectedIndex = 6;
  updateCountry();
  select_dialect.selectedIndex = 6;
  
  if (!('webkitSpeechRecognition' in window)) {
    upgrade();
  } else {
    showInfo('start');  
    start_button.style.display = 'inline-block';
    recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onstart = function() {
      recognizing = true;
      showInfo('speak_now');
      start_img.src = 'static/images/mic-animation.gif';
    };

    recognition.onerror = function(event) {
      if (event.error == 'no-speech') {
        start_img.src = 'images/mic.gif';
        showInfo('no_speech');
        ignore_onend = true;
      }
      if (event.error == 'audio-capture') {
        start_img.src = 'static/images/mic.gif';
        showInfo('no_microphone');
        ignore_onend = true;
      }
      if (event.error == 'not-allowed') {
        if (event.timeStamp - start_timestamp < 100) {
          showInfo('blocked');
        } else {
          showInfo('denied');
        }
        ignore_onend = true;
      }
    };

    recognition.onend = function() {
      recognizing = false;
      if (ignore_onend) {
        return;
      }
      start_img.src = 'static/images/mic.gif';
      if (!final_transcript) {
        showInfo('start');
        return;
      }
      showInfo('stop');
      if (window.getSelection) {
        window.getSelection().removeAllRanges();
        var range = document.createRange();
        range.selectNode(document.getElementById('final_span'));
        window.getSelection().addRange(range);
      }
    };

    recognition.onresult = function(event) {
      let interim_transcript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          final_transcript += event.results[i][0].transcript;
        } else {
          interim_transcript += event.results[i][0].transcript;
        }
      }
      final_transcript = capitalize(final_transcript);
      final_span.innerHTML = linebreak(final_transcript);
      interim_span.innerHTML = linebreak(interim_transcript);
    };
  }
});

function updateCountry() {
  for (let i = select_dialect.options.length - 1; i >= 0; i--) {
    select_dialect.remove(i);
  }
  var list = langs[select_language.selectedIndex];
  for (let i = 1; i < list.length; i++) {
    select_dialect.options.add(new Option(list[i][1], list[i][0]));
  }
  select_dialect.style.visibility = list[1].length == 1 ? 'hidden' : 'visible';
}


function upgrade() {
  start_button.style.visibility = 'hidden';
  showInfo('upgrade');
}

let two_line = /\n\n/g;
let one_line = /\n/g;
function linebreak(s) {
  return s.replace(two_line, '<p></p>').replace(one_line, '<br>');
}

let first_char = /\S/;
function capitalize(s) {
  return s.replace(first_char, function(m) { return m.toUpperCase(); });
}

$("#copy_button").click(function () {
  if (recognizing) {
    recognizing = false;
    recognition.stop();
  }
  setTimeout(copyToClipboard, 500);
  
});

function copyToClipboard() {
  if (document.selection) { 
      let range = document.body.createTextRange();
      range.moveToElementText(document.getElementById('results'));
      range.select().createTextRange();
      document.execCommand("copy"); 
  
  } else if (window.getSelection) {
      let range = document.createRange();
       range.selectNode(document.getElementById('results'));
       window.getSelection().addRange(range);
       document.execCommand("copy");
  }
  showInfo('copy');
}

$("#start_button").click(function () {
  if (recognizing) {
    recognition.stop();
    return;
  }
  final_transcript = '';
  recognition.lang = select_dialect.value;
  recognition.start();
  ignore_onend = false;
  final_span.innerHTML = '';
  interim_span.innerHTML = '';
  Destination.innerHTML = '';
  Partname.innerHTML = '';
  Quantity.innerHTML = '';
  start_img.src = 'static/images/mic-slash.gif';
  showInfo('allow');
  start_timestamp = event.timeStamp;
});

$("#select_language").change(function () {
  updateCountry();
});

function showInfo(s) {
  if (s) {
    let message = messages[s];
    $("#info").html(message.msg);
    $("#info").removeClass();
    $("#info").addClass('alert');
    $("#info").addClass(message.class);
  } else {
    $("#info").removeClass();
    $("#info").addClass('d-none');
  }
}

function senddata() {
    let result = final_transcript ;
    $.ajax({
        type: "POST",
        url: '/search',
        data: {
            "result": result,
        },
        dataType: "json",
        success: function (data) {
            console.log("Data sent successfull")
        },
        failure: function () {
            console.log("Data sent failure");
        }
    });
    const myTimeout = setTimeout(fetchdata, 2000);    
}

function fetchdata() {
   fetch('/search')
      .then(function(response) {
        return response.json();
      })
      .then(function(data) {
        console.log(data);
       // console.log(finalresponse);
       if(data.result.Search_Result === "Please try rephrasing or update the data")
       {
           finalresponse = data.result.Search_Result
           final_span.innerHTML = "Query-Text : " + data.result.Query_Text
           Partname.innerHTML = finalresponse
       }
       else
       {
           finalresponse = JSON.parse(data.result.Search_Result)
           final_span.innerHTML = "Query-Text : " + data.result.Query_Text
           if(data.result.value === 1)
           {
               Destination.innerHTML = "Location : "+ finalresponse.Location[0] 
               Partname.innerHTML = "Part-Name : "+ finalresponse.Part_Name[0]
               Quantity.innerHTML = "Quantity : "+ finalresponse.Quantity[0]
           }
           if(data.result.value === 2)
           {
               Destination.innerHTML = "Location : "+ finalresponse.Location[0]+ " , " + finalresponse.Location[1]
               Partname.innerHTML = "Part-Name : "+ finalresponse.Part_Name[0]+ " , " + finalresponse.Part_Name[1]
               Quantity.innerHTML = "Quantity : "+ finalresponse.Quantity[0]+ " , " + finalresponse.Quantity[1]
           }
           if(data.result.value === 3)
           {
               Destination.innerHTML = "Location : "+ finalresponse.Location[0]+ " , " + finalresponse.Location[1]+ " , " +                              finalresponse.Location[2]
               Partname.innerHTML = "Part-Name : "+ finalresponse.Part_Name[0]+ " , " + finalresponse.Part_Name[1]+ " , " +                              finalresponse.Part_Name[2]
               Quantity.innerHTML = "Quantity : "+ finalresponse.Quantity[0]+ " , " + finalresponse.Quantity[1]+ " , " +                                  finalresponse.Quantity[2]
           }
           if(data.result.value === 4)
           {
               Destination.innerHTML = "Location : "+ finalresponse.Location[0]+ " , " + finalresponse.Location[1]+ " , " +                              finalresponse.Location[2]+ " , " + finalresponse.Location[3]
               Partname.innerHTML = "Part-Name : "+ finalresponse.Part_Name[0]+ " , " + finalresponse.Part_Name[1]+ " , " +                              finalresponse.Part_Name[2]+ " , " + finalresponse.Part_Name[3]
               Quantity.innerHTML = "Quantity : "+ finalresponse.Quantity[0]+ " , " + finalresponse.Quantity[1]+ " , " +                                  finalresponse.Quantity[2]+ " , " + finalresponse.Quantity[3]
           }
           if(data.result.value === 5)
           {
               Destination.innerHTML = "Location : "+ finalresponse.Location[0]+ " , " + finalresponse.Location[1]+ " , " +                              finalresponse.Location[2]+ " , " + finalresponse.Location[3]+ " , " + finalresponse.Location[4]
               Partname.innerHTML = "Part-Name : "+ finalresponse.Part_Name[0]+ " , " + finalresponse.Part_Name[1]+ " , " +                              finalresponse.Part_Name[2]+ " , " + finalresponse.Part_Name[3]+ " , " + finalresponse.Part_Name[4]
               Quantity.innerHTML = "Quantity : "+ finalresponse.Quantity[0]+ " , " + finalresponse.Quantity[1]+ " , " +                                  finalresponse.Quantity[2]+ " , " + finalresponse.Quantity[3]+ " , " + finalresponse.Quantity[4]
           }
           if(data.result.value === 6)
           {
               Destination.innerHTML = "Location : "+ finalresponse.Location[0]+ " , " + finalresponse.Location[1]+ " , " +                              finalresponse.Location[2]+ " , " + finalresponse.Location[3]+ " , " + finalresponse.Location[4]+ " , " +                                  finalresponse.Location[5]
               Partname.innerHTML = "Part-Name : "+ finalresponse.Part_Name[0]+ " , " + finalresponse.Part_Name[1]+ " , " +                              finalresponse.Part_Name[2]+ " , " + finalresponse.Part_Name[3]+ " , " + finalresponse.Part_Name[4]+ " , " +                                finalresponse.Part_Name[5]
               Quantity.innerHTML = "Quantity : "+ finalresponse.Quantity[0]+ " , " + finalresponse.Quantity[1]+ " , " +                                  finalresponse.Quantity[2]+ " , " + finalresponse.Quantity[3]+ " , " + finalresponse.Quantity[4]+ " , " +                                  finalresponse.Quantity[5]
           }
           if(data.result.value === 7)
           {
               Destination.innerHTML = "Location : "+ finalresponse.Location[0]+ " , " + finalresponse.Location[1]+ " , " +                              finalresponse.Location[2]+ " , " + finalresponse.Location[3]+ " , " + finalresponse.Location[4]+ " , " +                                  finalresponse.Location[5]+ " , " + finalresponse.Location[6]
               Partname.innerHTML = "Part-Name : "+ finalresponse.Part_Name[0]+ " , " + finalresponse.Part_Name[1]+ " , " +                              finalresponse.Part_Name[2]+ " , " + finalresponse.Part_Name[3]+ " , " + finalresponse.Part_Name[4]+ " , " +                                finalresponse.Part_Name[5]+ " , " + finalresponse.Part_Name[6]
               Quantity.innerHTML = "Quantity : "+ finalresponse.Quantity[0]+ " , " + finalresponse.Quantity[1]+ " , " +                                  finalresponse.Quantity[2]+ " , " + finalresponse.Quantity[3]+ " , " + finalresponse.Quantity[4]+ " , " +                                  finalresponse.Quantity[5]+ " , " + finalresponse.Quantity[6]
           }
       }
      });
}
