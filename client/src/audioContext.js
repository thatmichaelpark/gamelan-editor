window.AudioContext = window.AudioContext || window.webkitAudioContext;
const audioContext = new AudioContext();
audioContext.createOscillator(); // Chrome bug: needs this to start audio clock.

export default audioContext;