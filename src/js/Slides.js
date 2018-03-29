export class Slides {
  constructor(doms) {
    this.index = -1;
    this.doms = doms;
  }

  next() {
    const prevDom = this.doms[this.index];
    const nextDom = this.doms[this.index + 1];
    if (nextDom) {
      if (prevDom) {
        prevDom.setAttribute('data-slide-active', '0');
      }
      nextDom.setAttribute('data-slide-active', '1');
      this.index = this.index + 1;
      const key = nextDom.getAttribute('data-slide-key');
      if (this.onSlideChange) {
        this.onSlideChange(this.index, key);
      }
    }
  }
}
