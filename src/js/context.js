const AudioContext = window.AudioContext || window.webkitAudioContext;
const context = AudioContext ? new AudioContext() : null;

export { context };
