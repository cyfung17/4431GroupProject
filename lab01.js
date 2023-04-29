// The last played key number
let last_mouse_key_number = -1;

// Map the key with the key number
let key_mapping = {
    // White keys of the first octave
    "z":  0, "x":  2, "c":  4, "v":  5, "b":  7, "n":  9, "m": 11,
    // Black keys of the first octave
    "s":  1, "d":  3, "g":  6, "h":  8, "j": 10,
    // White keys of the second octave
    "w": 12, "e": 14, "r": 16, "t": 17, "y": 19, "u": 21, "i": 23,
    // Black keys of the second octave
    "3": 13, "4": 15, "6": 18, "7": 20, "8": 22
}

// Signal the key is down
let key_down_status = new Array(23);

// Play or not play indicator
var should_start = 0;
// Array to store the play-not play pattern
var drum_array=[[0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0],];

// once we press the button or change the pattern, the array will change
// and drum sound will be played .
function drum_button(x,y){
    if (drum_array[x][y]==0){
        drum_array[x][y]=1;
        console.log(x,y)
    if(x==0){
        handleNoteOn(46);
        handleNoteOff(46);}
    else if(x==1){
        handleNoteOn(42);
        handleNoteOff(42);}
    else if(x==2){
        handleNoteOn(45);
        handleNoteOff(45);
    }
    else { handleNoteOn(40);
        handleNoteOff(40);}
    ;}
    else{drum_array[x][y]=0;
    }}

// modify for drum
function handleNoteOn(key_number) {
    // Find the pitch

    //drum case
    if (parseInt($("#midiinstrument").val())==0){
        // tabla only work for C4 to E6
        if (parseInt($("#mididrum").val())==118){
            var pitch = key_number + 20;
        }
        else{ var pitch = key_number; }
    }
    else{
      var pitch = parseInt($("#pitch").val()) + key_number;}
    /*
     * You need to use the slider to get the lowest pitch number above
     * rather than the hardcoded value
     */
    console.log("pitch number "+ pitch + " !");
    // Extract the amplitude value from the slider
    let amplitude = parseInt($("#amplitude").val());
  
    // Use the two numbers to start a MIDI note
    MIDI.noteOn(0, pitch, amplitude);
    let playmode = $(":radio[name=options]:checked").val();
    if(playmode == "option2"){
        MIDI.noteOn(0, pitch+4, amplitude);
        MIDI.noteOn(0, pitch+7, amplitude);
    }
    if(playmode == "option3"){
        MIDI.noteOn(0, pitch+3, amplitude);
        MIDI.noteOn(0, pitch+7, amplitude);
    }

    /*
     * You need to handle the chord mode here
     */

}

function handleNoteOff(key_number) {
    // Find the pitch
    //let pitch = 60 + key_number;
    if (parseInt($("#midiinstrument").val())==0){
        if (parseInt($("#mididrum").val())==118){
            var pitch = key_number + 20;
        }
        else{ var pitch = key_number; }
    }
    else{
      var pitch = parseInt($("#pitch").val()) + key_number;}
    /*
    console.log("pitch number "+ pitch + " !");

    /*
     * You need to use the slider to get the lowest pitch number above
     * rather than the hardcoded value
     */
    //let checkdrum = parseInt($("#mididrum").val());
  
   
    // Use the two numbers to start a MIDI note

    // Use the two numbers to start a MIDI note
    MIDI.noteOff(0, pitch);
    // Send the note off message for the pitch
    let playmode = $(":radio[name=options]:checked").val();
    if(playmode == "option2"){
        MIDI.noteOff(0, pitch+4);
        MIDI.noteOff(0, pitch+7);
        }
     if(playmode == "option3"){
        MIDI.noteOff(0, pitch+3);
        MIDI.noteOff(0, pitch+7);
        }    


    /*
     * You need to handle the chord mode here
     */

}
/*function handleDrumNote(key,OnOff){
    MIDI.noteOn(0, key, OnOff*amplitude);
    MIDI.noteOff(0,key);

}*/
// this is the function for press the play button
function handleDrumLoopOn(){
    console.log("yes")
    should_start=1;
    var bpm = 60/(parseInt($("#BPM").val()));
    console.log("bpm is"+ bpm);
    for (let i = 0; i < 300000; i++) {
        const timeoutId = setTimeout(function() {
            if (should_start==0){
              return;
            }  
            if(drum_array[0][i%8]==1){
            handleNoteOn(46);
            handleNoteOff(46);
            }
            if(drum_array[1][i%8]==1){
            handleNoteOn(42);
            handleNoteOff(42);}
            if(drum_array[2][i%8]==1){
            handleNoteOn(45);
            handleNoteOff(45);}
        
            if(drum_array[3][i%8]==1){
            handleNoteOn(40);
            handleNoteOff(40);}
        
        
         },i*1000*bpm)
         
        
       
     }

    
}
// this 
function handleDrumLoopOff(){
    should_start=0;

}

function handlePianoMouseDown(evt) {
    // Determine which piano key has been clicked on
    // evt.target tells us which item triggered this function
    // The piano key number is extracted from the key id (0-23)
    if(parseInt($("#midiinstrument").val())==0) return;
    let key_number = $(evt.target).attr("id").substring(4);
    //console.log(key_number)
    if(!Number.isInteger(key_number)) return;
    key_number = parseInt(key_number);

    // Start the note
    handleNoteOn(key_number);

    // Select the key
    $("#key-" + key_number).focus();

    // Show a simple message in the console
    console.log("Piano mouse down event for key " + key_number + "!");

    // Remember the key number
    last_mouse_key_number = key_number;
}

function handlePianoMouseUp(evt) {
    // last_key_number is used because evt.target does not necessarily
    // equal to the key that has been clicked on 
    if (last_mouse_key_number < 0) return;
    
    // Stop the note
    handleNoteOff(last_mouse_key_number);

    // De-select the key
    $("#key-" + last_mouse_key_number).blur();

    // Show a simple message in the console
    console.log("Piano mouse up event for key " + last_mouse_key_number + "!");

    // Reset the key number
    last_mouse_key_number = -1;
}

function handlePageKeyDown(evt) {
    // Exit the function if the key is not a piano key
    // evt.key tells us the key that has been pressed
    //console.log(evt.key);
    if (!(evt.key in key_mapping)) return;
    //console.log(evt.key+"test");
    // Find the key number of the key that has been pressed
    let key_number = key_mapping[evt.key];
    if (key_down_status[key_number]) return;

    // Start the note
    handleNoteOn(key_number);

    // Select the key
    $("#key-" + key_number).focus();

    // Show a simple message in the console
    console.log("Page key down event for key " + key_number + "!");

    // Remember the key is down
    key_down_status[key_number] = true;
}

function handlePageKeyUp(evt) {
    // Exit the function if the key is not a piano key
    // evt.key tells us the key that has been released
    if (!(evt.key in key_mapping)) return;
    
    // Find the key number of the key that has been released
    let key_number = key_mapping[evt.key];

    // Stop the note
    handleNoteOff(key_number);

    // De-select the key
    $("#key-" + key_number).blur();

    // Show a simple message in the console
    console.log("Page key up event for key " + key_number + "!");

    // Reset the key status
    key_down_status[key_number] = false;
}


/*
 * You need to write an event handling function for the instrument
 */
function ChangeProgram(evt){

    let insnumber =  parseInt($("#midiinstrument").val());
    if (insnumber==0){
        let drum_number = parseInt($("#mididrum").val());
        MIDI.programChange(0,drum_number);
    }
   
    else{
        MIDI.programChange(0,insnumber);
    }
    console.log("instrument number "+insnumber + " !");
   
}


$(document).ready(function() {
    MIDI.loadPlugin({
        soundfontUrl: "./midi-js/soundfont/",
        instruments: [
            "trumpet",

            //"Grand Acoustic Piano","Electric Grand Piano","Music Box","Violin","Viola","Cello","Electric Guitar(Jazz)","Acoustic Guitar(Nylon)","Telephone Ring"
          

            
            /*
             * You can preload the instruments here if you add the instrument
             * name in the list here
             */
        ],
        onprogress: function(state, progress) {
            console.log(state, progress);
        },
        onsuccess: function() {
            // Resuming the AudioContext when there is user interaction
            $("body").click(function() {
                if (MIDI.getContext().state != "running") {
                    MIDI.getContext().resume().then(function() {
                        console.log("Audio Context is resumed!");
                    });
                }
            });

            // Hide the loading text and show the container
            $(".loading").hide();
            $(".container").show();

            // At this point the MIDI system is ready
            MIDI.setVolume(0, 127);     // Set the volume level
            MIDI.programChange(0, 0);  // Use the General MIDI 'trumpet' number

            // Set up the event handlers for all the buttons
            $("button").on("mousedown", handlePianoMouseDown);
            $(document).on("mouseup", handlePianoMouseUp);

            // Set up key events
            $(document).keydown(handlePageKeyDown);
            $(document).keyup(handlePageKeyUp);
            addEventListener("input", ChangeProgram);
            $("#btnPlay").on("click", function() { handleDrumLoopOn() ; });
            $("#btnStop").on("click", function() { handleDrumLoopOff(); });

            /*
             * You need to set up the event for the instrument 
             */

        }
    });
});
