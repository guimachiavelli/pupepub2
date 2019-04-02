// set up
const textarea = document.querySelector("[data-audio-type]");
textarea.addEventListener("click", startAudio);
textarea.addEventListener("keyup", playAudio);

function startAudio() {
  Tone.start();
}

// audio settings

// wave types we will use
// repeating sine so the resulting sounds are softer
const waves = [
  "sine",
  "sine",
  "sine",
  "triangle",
  "triangle",
  "sine",
  "sine",
  "square",
  "sine",
  "triangle",
  "triangle"
];
const commandKey = 93;

let isDistorted = false;

const phaser = new Tone.Phaser({
  frequency: 5,
  octaves: 3,
  stages: 10,
  Q: 10,
  baseFrequency: 350
});

// audio synthesis
function playAudio(event) {
  // code assigned to the key that was pressed
  const keycode = event.keyCode;

  // if user pressed command key, toggle isDistorted between true and false
  // and do not play any sounds
  if (keycode === commandKey) {
    isDistorted = !isDistorted;
    return;
  }

  // create distortion
  // if isDistorted is true, distortion is set to 1
  // otherwise, distortion is set to 0 (no distortion)
  const distortion = new Tone.Distortion(isDistorted ? 1 : 0);

  // select waves based on the remainder of the keycode divided by
  // the number of wave types we have decided to use
  const wave = waves[keycode % waves.length];
  console.log(wave);

  // create synth
  let synth = new Tone.Synth({
    oscillator: {
      type: wave
    },
    envelope: {
      attack: 5,
      decay: 0,
      sustain: 0,
      release: 5
    }
  });

  // reduce synth value to avoid too much cracking
  synth.volume.value = -10;

  if (wave === "square") {
    synth.volume.value = -15;
  }

  // pass the synth through a distortion filter,
  // then through a phaser
  // and then send it to the master output (speakers)
  synth.chain(distortion, phaser, Tone.Master);

  // if user types uppercase letters with either CapsLock or shift key,
  // multiply pitch by 5
  const isUppercase =
    event.getModifierState("Shift") || event.getModifierState("CapsLock");
  const multiplier = isUppercase ? 5 : 1;

  // play the sound with a frequency of the keycode value times the multiplier
  // for 10 seconds
  synth.triggerAttackRelease(keycode * multiplier, 10);
}
