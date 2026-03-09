import Stats from 'stats.js';

class StatsOverlay {
  constructor({ isEnabled, mountPoint } = {}) {
    this.isEnabled = Boolean(isEnabled && mountPoint);
    if (this.isEnabled) {
      this.stats = new Stats();
      this.stats.showPanel(0);
      mountPoint.appendChild(this.stats.dom);
    }
  }

  beginFrame() {
    if (!this.isEnabled) return;
    this.stats.begin();
  }

  endFrame() {
    if (!this.isEnabled) return;
    this.stats.end();
  }
}

export default StatsOverlay;
