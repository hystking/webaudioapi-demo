import { context } from './context';

export class Track {
  constructor(path, gain) {
    this.path = path;
    this.buffer = null;
    this.gain = gain;
  }

  loadBuffer() {
    if (this.path == null) {
      return Promise.resolve();
    }
    return new Promise(resolve => {
      const request = new XMLHttpRequest();
      request.open('GET', this.path, true);
      request.responseType = 'arraybuffer';
      request.onload = () => {
        context.decodeAudioData(request.response, buffer => {
          this.buffer = buffer;
          resolve();
        });
      };
      request.send();
    });
  }

  start(time) {
    const source = context.createBufferSource();
    source.buffer = this.buffer;
    source.connect(this.gain);
    source.start(time);
  }
}


