export class SignalGenerator {
  constructor(context, bpm) {
    this.context = context;
    this.bpm = bpm;
    this.prevTime = 0;
    this.startTime = null;
    this.callbacks = [];
    this.tick = time => {
      this.update(time);
      requestAnimationFrame(this.tick);
    };
  }

  update(rawTime) {
    const time = this.context.currentTime - this.startTime;
    for (let i = 0; i < this.callbacks.length; i += 1) {
      const callback = this.callbacks[i];
      const callbackIndex = Math.floor(
        time / 60 * this.bpm * callback.beat / 16 - callback.offset,
      );
      if (callbackIndex !== callback.prevIndex) {
        callback.func(callbackIndex, this.timeAt(callback.beat, callbackIndex));
      }
      callback.prevIndex = callbackIndex;
    }
    this.prevTime = time;
  }

  timeAt(beat, index) {
    return 16 / this.bpm * 60 * index / beat;
  }

  addCallback(beat, offset, func) {
    const callback = {
      beat,
      func,
      offset,
      prevIndex: 0,
    };
    this.callbacks.push(callback);
  }

  start(startTime) {
    this.startTime = startTime;
    requestAnimationFrame(this.tick);
  }

  beatFrac(beat) {
    const time = this.context.currentTime - this.startTime;
    return (time / 60 * this.bpm * beat / 16) % 1;
  }
}
