import _ from 'lodash';
import Reverb from './Reverb';
import { SignalGenerator } from './SignalGenerator';
import { Track } from './Track';
import { Slides } from './Slides';
import { context } from './context';

const reverb = Reverb(context);
const mix = context.createGain();
const master = context.createGain();
const highpass = context.createBiquadFilter();
const lowpass = context.createBiquadFilter();

highpass.type = 'highpass';
lowpass.type = 'lowpass';

highpass.frequency.setTargetAtTime(0, 0, 0);
lowpass.frequency.setTargetAtTime(highpass.frequency.maxValue, 0, 0);
reverb.wet.setTargetAtTime(0.3, 0, 0);
reverb.dry.setTargetAtTime(0.8, 0, 0);

mix.connect(reverb);
reverb.connect(lowpass);
lowpass.connect(highpass);
highpass.connect(master);
master.connect(context.destination);

// スマホで任意のタイミングで砕石できるようになる魔法
function onFirstPointerDown() {
  document.body.removeEventListener("touchstart", onFirstPointerDown)
  document.body.removeEventListener("mousedown", onFirstPointerDown)
  context.createBufferSource().start(0)
}
document.body.addEventListener("touchstart", onFirstPointerDown)
document.body.addEventListener("mousedown", onFirstPointerDown)

export default function index() {
  const bpm = 120;

  const signalGenerator = new SignalGenerator(context, 120);
  signalGenerator.start(context.currentTime);

  const lackDatas = {
    bass: [
      {},
      {
        path: 'audio/stems/bass/1.mp3',
      },
    ],
    effects: [
      {},
      {
        path: 'audio/stems/effects/1.mp3',
      },
    ],
    pad: [
      {},
      {
        path: 'audio/stems/pad/1.mp3',
      },
    ],
    pianoMelody: [
      {},
      {
        path: 'audio/stems/piano_melody/1.mp3',
      },
      {
        path: 'audio/stems/piano_melody/2.mp3',
      },
      {
        path: 'audio/stems/piano_melody/3.mp3',
      },
      {
        path: 'audio/stems/piano_melody/4.mp3',
      },
      {
        path: 'audio/stems/piano_melody/5.mp3',
      },
      {
        path: 'audio/stems/piano_melody/6.mp3',
      },
      {
        path: 'audio/stems/piano_melody/7.mp3',
      },
      {
        path: 'audio/stems/piano_melody/8.mp3',
      },
    ],
    drums: [
      {},
      {
        path: 'audio/stems/drums/1.mp3',
      },
      {
        path: 'audio/stems/drums/2.mp3',
      },
      {
        path: 'audio/stems/drums/3.mp3',
      },
    ],
    kick: [
      {},
      {
        path: 'audio/stems/kick/1.mp3',
      },
      {
        path: 'audio/stems/kick/2.mp3',
      },
      {
        path: 'audio/stems/kick/3.mp3',
      },
    ],
    pianoBacking: [
      {},
      {
        path: 'audio/stems/piano_backing/1.mp3',
      },
      {
        path: 'audio/stems/piano_backing/2.mp3',
      },
      {
        path: 'audio/stems/piano_backing/3.mp3',
      },
      {
        path: 'audio/stems/piano_backing/4.mp3',
      },
    ],
    pluck: [
      {},
      {
        path: 'audio/stems/pluck/1.mp3',
      },
    ],
  };

  const lack = _.mapValues(lackDatas, trackDatas => {
    const gain = context.createGain();
    gain.connect(mix);
    return {
      gain,
      tracks: _.map(trackDatas, trackData => new Track(trackData.path, gain)),
    };
  });

  const lackIndicies = _.mapValues(lack, () => {
    return 0;
  });

  const state = {
    mode: 'silent',
  };

  function getPianoMelodyRandom() {
    const pianoMelodyList = [1, 2, 3, 4, 5, 7, 8];
    return pianoMelodyList[Math.floor(pianoMelodyList.length * Math.random())];
  }

  function getPianoBackingRandom() {
    return (
      Math.floor(Math.random() * (lack.pianoBacking.tracks.length - 1)) + 1
    );
  }

  function getDrumsRandom() {
    return Math.floor(Math.random() * (lack.drums.tracks.length - 1)) + 1;
  }

  function getKickRandom() {
    return Math.floor(Math.random() * (lack.kick.tracks.length - 1)) + 1;
  }

  signalGenerator.addCallback(1 / 2, -0.02, function(k, nextTime) {
    switch (state.mode) {
      case 'silent':
        lackIndicies.kick = 0;
        lackIndicies.drums = 0;
        lackIndicies.pianoBacking = 0;
        lackIndicies.pianoMelody = 0;
        lackIndicies.bass = 0;
        lackIndicies.pad = 0;
        lackIndicies.pluck = 0;
        lackIndicies.effects = 0;
        break;
      case 'drums-only':
        lackIndicies.kick = 1;
        lackIndicies.drums = 1;
        lackIndicies.pianoBacking = 0;
        lackIndicies.pianoMelody = 0;
        lackIndicies.bass = 0;
        lackIndicies.pad = 0;
        lackIndicies.pluck = 0;
        lackIndicies.effects = 1;
        break;
      case 'kasane1':
        lackIndicies.kick = 1;
        lackIndicies.drums = 1;
        lackIndicies.pianoBacking = 1;
        lackIndicies.pianoMelody = 0;
        lackIndicies.bass = 0;
        lackIndicies.pad = 0;
        lackIndicies.pluck = 0;
        lackIndicies.effects = 1;
        break;
      case 'kasane2':
        lackIndicies.kick = 1;
        lackIndicies.drums = 1;
        lackIndicies.pianoBacking = 1;
        lackIndicies.pianoMelody = 0;
        lackIndicies.bass = 1;
        lackIndicies.pad = 1;
        lackIndicies.pluck = 1;
        lackIndicies.effects = 1;
        break;
      case 'free':
        lackIndicies.kick = getKickRandom();
        lackIndicies.drums = getDrumsRandom();
        lackIndicies.pianoBacking = getPianoBackingRandom();
        lackIndicies.pianoMelody = getPianoMelodyRandom();
        lackIndicies.bass = 1;
        lackIndicies.pad = 1;
        lackIndicies.pluck = 1;
        lackIndicies.effects = 1;
        break;
      case 'outro':
        lackIndicies.kick = 2
        lackIndicies.drums = 3
        lackIndicies.pianoBacking = 1;
        lackIndicies.pianoMelody = getPianoMelodyRandom();
        lackIndicies.bass = 0;
        lackIndicies.pad = 0;
        lackIndicies.pluck = 0;
        lackIndicies.effects = 1;
        break;
      case 'shelter':
        lackIndicies.kick = 2
        lackIndicies.drums = 3
        lackIndicies.pianoBacking = 1;
        lackIndicies.pianoMelody = 6;
        lackIndicies.bass = 0;
        lackIndicies.pad = 0;
        lackIndicies.pluck = 0;
        lackIndicies.effects = 1;
        break;
    }
  });

  const doms = _.map(document.getElementsByClassName('js-slide'), e => e);
  const slides = new Slides(doms);
  slides.next();
  slides.onSlideChange = (index, key) => {
    switch (key) {
      case 'silent':
      case 'drums-only':
      case 'kasane1':
      case 'kasane2':
      case 'free':
      case 'outro':
      case 'shelter':
        state.mode = key;
        break;
      case 'fade':
        break;
      case 'highpass':
        highpass.frequency.setTargetAtTime(500, 0, 0);
        lowpass.frequency.setTargetAtTime(highpass.frequency.maxValue, 0, 0);
        reverb.wet.setTargetAtTime(0.3, 0, 0);
        reverb.dry.setTargetAtTime(0.8, 0, 0);
        break;
      case 'lowpass':
        highpass.frequency.setTargetAtTime(0, 0, 0);
        lowpass.frequency.setTargetAtTime(500, 0, 0);
        reverb.wet.setTargetAtTime(0.3, 0, 0);
        reverb.dry.setTargetAtTime(0.8, 0, 0);
        break;
      case 'reverb':
        highpass.frequency.setTargetAtTime(0, 0, 0);
        lowpass.frequency.setTargetAtTime(highpass.frequency.maxValue, 0, 0);
        reverb.wet.setTargetAtTime(1, 0, 0);
        reverb.dry.setTargetAtTime(0, 0, 0);
        break;
      case 'reset-effects':
        highpass.frequency.setTargetAtTime(0, 0, 0);
        lowpass.frequency.setTargetAtTime(highpass.frequency.maxValue, 0, 0);
        reverb.wet.setTargetAtTime(0.3, 0, 0);
        reverb.dry.setTargetAtTime(0.8, 0, 0);
        break;
    }
    console.log(index, key);
  };

  window.addEventListener('click', () => {
    slides.next();
  });

  Promise.all(
    _(lack)
      .map(tracks => {
        return _.map(tracks.tracks, track => track.loadBuffer());
      })
      .flatten()
      .value(),
  ).then(() => {
    _.forEach(lack, (tracks, key) => {
      const beat = key === 'effects' ? 1 / 2 : 1;
      signalGenerator.addCallback(beat, -0.01, function(k, nextTime) {
        const index = lackIndicies[key];
        tracks.tracks[index].start(nextTime);
      });
    });
  });

  const barDom = document.getElementById("beatBar");
  function barTick(time) {
    barDom.style.transform = `scale(${signalGenerator.beatFrac(1 / 2)}, 1)`;
    requestAnimationFrame(barTick);
  }
  requestAnimationFrame(barTick);
}
