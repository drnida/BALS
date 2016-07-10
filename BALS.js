
var midi = null;  
var stepsPerMin = 60.0
var timePerStep = (60000.0/stepsPerMin) * .5;
var kill = null;
var notes = ["60", "78", "50", "34", "43", "53", "67", "76", "60", "32", "45", "60", "70", "79", "72", "60", "36", "40", "47", "69", "72", "71", "48", "40", "20", "71", "50", "43", "37", "38", "50", "70"];
var toggledSteps = [false, true, false, true, true, true, true, true, false, true, true, true, true, true, true, false, true, true, true, true, true, true, true, true, false, true, true, true, true, true, true, true];
var step = 0;
var maxSteps = 32;
var numSteps = maxSteps;
var kill = false;




function addStep(stepNum){

  var step = document.createElement("div");
  step.setAttribute("class", "step");
  step.setAttribute("overflow", "auto");
  var slider = document.createElement("input");
  slider.type = "range";
  slider.id = "note_" + stepNum ;
  slider.value = notes[stepNum];
  slider.setAttribute("stepnumber", stepNum);
  slider.setAttribute("orient", "vertical");
  slider.setAttribute("onkeydown", "swichInput(this.id, event)");
  slider.setAttribute("oninput", "updateNote(this.id, this.value)");
  step.appendChild(slider);

  var stepValue = document.createElement("div");
  stepValue.setAttribute("class", "stepValue");
  stepValue.id = "stepValue_" + stepNum;
  stepValue.appendChild(document.createTextNode(slider.value));
  step.appendChild(stepValue);
  
  
  var stepOn = document.createElement("div");
  stepOn.setAttribute("class", "stepON");
  stepOn.id = "stepON_" + stepNum;
  var button = document.createElement("input");
  button.type = "checkbox";
  button.id = "stepOn_" + stepNum ;
  button.setAttribute("checked", "false");
  console.log(button.checked)
  button.setAttribute("onclick", "toggleStep(this.id, this.checked)");
  stepOn.appendChild(button);
  step.appendChild(stepOn);


  var blinkers = document.createElement("div");
  blinkers.setAttribute("class", "blinkers");
  blinkers.id = "blinkersDiv_" + stepNum;
  var button = document.createElement("input");
  button.type = "radio";
  button.id = "blinker_" + stepNum;
  // button.setAttribute("checked", false);
  // button.setAttribute("onclick", "turnOff(this.id, this.checked)");
  blinkers.appendChild(button);
  step.appendChild(blinkers);

  
  var steps = document.getElementById("steps");
  steps.appendChild(step);
}


function toggleStep(id, checked){
  var stepNum = Number(id.split("_")[1]);
  var stepOn = document.getElementById("stepOn_" + stepNum);
  console.log(checked, "turn on the jams", "stepOn_" + stepNum, stepNum);
  
  toggledSteps[stepNum] = checked; 
  console.log("playingSteps", toggledSteps);  
}


function updateNote(id, val){
  var stepNum = Number(id.split("_")[1]);
  var sliderValue = document.getElementById("stepValue_" + stepNum);
  sliderValue.innerHTML  = val;
  notes[stepNum] = val
  console.log("playing Notes", notes, "stepValue_" +stepNum, stepNum)
  
}

function swichInput(id, event){
  var stepNum = Number(id.split("_")[1]);
  if (event.keyCode === 37){
    event.preventDefault();
    var nextSlider = document.getElementById("note_"+(stepNum-1));
    nextSlider.focus();
  }

  if (event.keyCode === 39){
    event.preventDefault();
    var nextSlider = document.getElementById("note_"+(stepNum+1));
    nextSlider.focus();
  }

}


function setNumSteps(event, val){
  console.log("key" , val);
  if (event.keyCode == 13){
    if (Number(val) > 0 && Number(val) <= maxSteps){
        numSteps = Number(val);
      console.log("set", numSteps);
    }
  }
  
}


function changeTempo(value){
  stepsPerMin = Number(value);
  timePerStep = 60000/stepsPerMin;
  console.log("tempo change", timePerStep);
}


var sent = 0;
function beepOn(note, duration) {
  var noteOnMessage = [0x90, note, 0x7f];    
  var output = midi.outputs.get(1324057213);
  if(kill){
    kill = false;
    return;
  }
  
  if (toggledSteps[step%numSteps] === true){
    output.send( noteOnMessage );  
  }
  sent = 1;
  console.log("beep");
  var blinker = document.getElementById("blinker_" + step%numSteps);
  blinker.checked = true;
  setTimeout(beepOff, duration, note);

  

}

function beepOff(note) {
  var output = midi.outputs.get(1324057213);
  output.send( [0x80, note, 0x40] );
  console.log("beep off");   
  var blinker = document.getElementById("blinker_" + step%numSteps);
  blinker.checked = false;
  ++step;
  beepOn(notes[step%numSteps], timePerStep);
}


function playPattern(){
    console.log("beeps started");
    beepOn(notes[step], timePerStep);
  
}







window.onload = function() {
  for (i = 0; i < numSteps; ++i){
    addStep(i);
    var stepOn = document.getElementById("stepOn_" + i);
    stepOn.checked = toggledSteps[i];


  }

  var startTempo = document.getElementById("tempo");
  stepsPerMin = startTempo.value;
  console.log(startTempo.value);
  console.log(stepsPerMin);
  console.log(timePerStep);
  console.log(notes.length);

};



















navigator.requestMIDIAccess().then( onMIDISuccess, onMIDIFailure );




function sendNote(note, start, duration, midiAccess, portID, step){
  var noteOnMessage = [0x90, note, 0x7f];    
  var output = midiAccess.outputs.get(portID);
  output.send( noteOnMessage, window.performance.now() + start );  
  output.send( [0x80, note, 0x40], window.performance.now() + start + duration );   
}





// function playPattern(){
//   function foo(){
//     if (step - 1 < 0){ //is the previous step  off the chart reset the last note
//       var blinker = document.getElementById("blinker_" + (numSteps - 1));
//       blinker.checked = false;
//     }
//     else {
//       var blinker = document.getElementById("blinker_" + (step - 1));
//       blinker.checked = false
//     }


//     var blinker = document.getElementById("blinker_" + step);
//     blinker.checked = true;

//     if (toggledSteps[step] === true){
//       sendNote(notes[step], 0, timePerStep, midi, 1324057213, step );
//     }
  
//     if (step >= (numSteps - 1)){
//       step = 0;
//     }
//     else{ ++step; 
//           // stepsPerMin = document.getElementById("tempo").value;
//           // timePerStep = 60000/stepsPerMin;
//            clearInterval(kill);
//            console.log('rotate', timePerStep)
//            kill = setInterval(foo, timePerStep);
         
//         } 
//   }
//   kill = setInterval(foo, timePerStep);
// }

function killIt(){
  kill = true;
  console.log(kill);
  clearInterval(kill);
  
}



function onMIDISuccess( midiAccess ) {
  console.log( "MIDI ready!" );
  midi = midiAccess;  

//  listInputsAndOutputs(midi);
}

function onMIDIFailure(msg) {
  console.log( "Failed to get MIDI access - " + msg );
}


function listInputsAndOutputs( midiAccess ) {
  for (var entry of midiAccess.inputs) {
    var input = entry[1];
    console.log( "Input port [type:'" + input.type + "'] id:'" + input.id +
      "' manufacturer:'" + input.manufacturer + "' name:'" + input.name +
      "' version:'" + input.version + "'" );
  }

  for (var entry of midiAccess.outputs) {
    var output = entry[1];
    console.log( "Output port [type:'" + output.type + "'] id:'" + output.id +
      "' manufacturer:'" + output.manufacturer + "' name:'" + output.name +
      "' version:'" + output.version + "'" );
  }
}