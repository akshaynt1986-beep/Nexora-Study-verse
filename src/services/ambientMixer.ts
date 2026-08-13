export interface AmbientSoundDefinition {
  id: string;
  name: string;
  icon: string;
  category: 'Weather' | 'Nature' | 'Places' | 'Elements' | 'Activity';
}

export const AMBIENT_SOUNDS: AmbientSoundDefinition[] = [
  { id: 'rain', name: 'Rain', icon: '🌧️', category: 'Weather' },
  { id: 'thunder', name: 'Thunder', icon: '⛈️', category: 'Weather' },
  { id: 'ocean', name: 'Ocean Waves', icon: '🌊', category: 'Nature' },
  { id: 'forest', name: 'Forest Pines', icon: '🌲', category: 'Nature' },
  { id: 'fireplace', name: 'Fireplace', icon: '🔥', category: 'Elements' },
  { id: 'cafe', name: 'Cozy Café', icon: '☕', category: 'Places' },
  { id: 'library', name: 'Library Focus', icon: '📚', category: 'Places' },
  { id: 'wind', name: 'Swirling Wind', icon: '🌬️', category: 'Weather' },
  { id: 'city', name: 'Night City', icon: '🌃', category: 'Places' },
  { id: 'keyboard', name: 'Keyboard Typing', icon: '⌨️', category: 'Activity' },
  { id: 'train', name: 'Night Train', icon: '🚆', category: 'Activity' },
  { id: 'birds', name: 'Morning Birds', icon: '🐦', category: 'Nature' },
  { id: 'night', name: 'Night Crickets', icon: '🌙', category: 'Nature' },
];

export class AmbientMixerService {
  private static ctx: AudioContext | null = null;
  private static masterGain: GainNode | null = null;
  private static isMuted = false;
  private static soundChannels: Map<
    string,
    {
      gainNode: GainNode;
      stop: () => void;
      updateVolume: (vol: number) => void;
    }
  > = new Map();

  private static getContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(1.0, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  static setMute(muted: boolean): void {
    this.isMuted = muted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(muted ? 0 : 1, this.ctx.currentTime);
    }
  }

  static getMute(): boolean {
    return this.isMuted;
  }

  static updateSoundVolume(soundId: string, volume: number): void {
    const channel = this.soundChannels.get(soundId);
    if (volume > 0) {
      if (!channel) {
        this.startSound(soundId, volume);
      } else {
        channel.updateVolume(volume);
      }
    } else {
      if (channel) {
        channel.stop();
        this.soundChannels.delete(soundId);
      }
    }
  }

  static stopAll(): void {
    this.soundChannels.forEach((channel) => {
      channel.stop();
    });
    this.soundChannels.clear();
  }

  static applySoundMap(volumes: Record<string, number>): void {
    // Stop sounds not in volumes or volume === 0
    this.soundChannels.forEach((channel, soundId) => {
      if (!volumes[soundId] || volumes[soundId] <= 0) {
        channel.stop();
        this.soundChannels.delete(soundId);
      }
    });

    // Start or update sounds with volume > 0
    Object.entries(volumes).forEach(([soundId, vol]) => {
      if (vol > 0) {
        this.updateSoundVolume(soundId, vol);
      }
    });
  }

  private static startSound(soundId: string, initialVol: number): void {
    const ctx = this.getContext();
    if (!this.masterGain) return;

    const channelGain = ctx.createGain();
    channelGain.gain.setValueAtTime(Math.min(1, Math.max(0, initialVol)), ctx.currentTime);
    channelGain.connect(this.masterGain);

    let stopFn: () => void = () => {};
    let updateFn: (v: number) => void = (v) => {
      channelGain.gain.setValueAtTime(Math.min(1, Math.max(0, v)), ctx.currentTime);
    };

    switch (soundId) {
      case 'rain': {
        // Pink Noise filtered for steady rain
        const bufferSize = ctx.sampleRate * 3;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.96900 * b2 + white * 0.153852;
          b3 = 0.8665 * b3 + white * 0.3104856;
          b4 = 0.55 * b4 + white * 0.5329522;
          b5 = -0.7616 * b5 - white * 0.016898;
          output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.08;
          b6 = white * 0.115926;
        }
        const source = ctx.createBufferSource();
        source.buffer = noiseBuffer;
        source.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 1000;

        source.connect(filter);
        filter.connect(channelGain);
        source.start();

        stopFn = () => {
          try {
            source.stop();
          } catch {}
        };
        break;
      }

      case 'thunder': {
        // Periodic low rumble thunder synth
        const osc = ctx.createOscillator();
        osc.type = 'sawtooth';
        osc.frequency.value = 55;

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 120;

        const lfo = ctx.createOscillator();
        lfo.type = 'sine';
        lfo.frequency.value = 0.05; // rumble pulse every 20s
        const lfoGain = ctx.createGain();
        lfoGain.gain.value = 0.3;

        lfo.connect(lfoGain);
        lfoGain.connect(channelGain.gain);

        osc.connect(filter);
        filter.connect(channelGain);

        osc.start();
        lfo.start();

        stopFn = () => {
          try {
            osc.stop();
            lfo.stop();
          } catch {}
        };
        break;
      }

      case 'ocean': {
        // Modulated pink noise wave sweeps
        const bufferSize = ctx.sampleRate * 2;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          output[i] = (Math.random() * 2 - 1) * 0.08;
        }
        const source = ctx.createBufferSource();
        source.buffer = noiseBuffer;
        source.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';

        // LFO sweeps filter between 200Hz and 800Hz to sound like ocean swells
        const lfo = ctx.createOscillator();
        lfo.frequency.value = 0.12; // wave every 8 seconds
        const lfoGain = ctx.createGain();
        lfoGain.gain.value = 400;

        lfo.connect(lfoGain);
        lfoGain.connect(filter.frequency);

        source.connect(filter);
        filter.connect(channelGain);

        source.start();
        lfo.start();

        stopFn = () => {
          try {
            source.stop();
            lfo.stop();
          } catch {}
        };
        break;
      }

      case 'forest': {
        // Rustling breeze + pine resonance
        const osc = ctx.createOscillator();
        osc.type = 'triangle';
        osc.frequency.value = 180;

        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = 600;

        osc.connect(filter);
        filter.connect(channelGain);
        osc.start();

        stopFn = () => {
          try {
            osc.stop();
          } catch {}
        };
        break;
      }

      case 'fireplace': {
        // Crackling fireplace sound (low hum + random crackle clicks)
        const bufferSize = ctx.sampleRate * 2;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          // Mostly quiet with random pops
          const isPop = Math.random() < 0.002;
          output[i] = isPop ? (Math.random() * 2 - 1) * 0.8 : (Math.random() * 2 - 1) * 0.03;
        }
        const source = ctx.createBufferSource();
        source.buffer = noiseBuffer;
        source.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 1500;

        source.connect(filter);
        filter.connect(channelGain);
        source.start();

        stopFn = () => {
          try {
            source.stop();
          } catch {}
        };
        break;
      }

      case 'cafe': {
        // Coffee shop warm chatter hum + soft room acoustics
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        osc1.type = 'sine';
        osc2.type = 'triangle';
        osc1.frequency.value = 130.81; // C3
        osc2.frequency.value = 196.0; // G3

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 500;

        osc1.connect(filter);
        osc2.connect(filter);
        filter.connect(channelGain);

        osc1.start();
        osc2.start();

        stopFn = () => {
          try {
            osc1.stop();
            osc2.stop();
          } catch {}
        };
        break;
      }

      case 'library': {
        // Library silence: 432Hz deep focus harmonic
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.value = 432;

        osc.connect(channelGain);
        osc.start();

        stopFn = () => {
          try {
            osc.stop();
          } catch {}
        };
        break;
      }

      case 'wind': {
        // Swirling wind bandpass noise
        const bufferSize = ctx.sampleRate * 2;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          output[i] = (Math.random() * 2 - 1) * 0.05;
        }
        const source = ctx.createBufferSource();
        source.buffer = noiseBuffer;
        source.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = 400;

        const lfo = ctx.createOscillator();
        lfo.frequency.value = 0.15;
        const lfoGain = ctx.createGain();
        lfoGain.gain.value = 250;

        lfo.connect(lfoGain);
        lfoGain.connect(filter.frequency);

        source.connect(filter);
        filter.connect(channelGain);

        source.start();
        lfo.start();

        stopFn = () => {
          try {
            source.stop();
            lfo.stop();
          } catch {}
        };
        break;
      }

      case 'city': {
        // Distant city traffic rumble
        const osc = ctx.createOscillator();
        osc.type = 'sawtooth';
        osc.frequency.value = 60;

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 150;

        osc.connect(filter);
        filter.connect(channelGain);
        osc.start();

        stopFn = () => {
          try {
            osc.stop();
          } catch {}
        };
        break;
      }

      case 'keyboard': {
        // Subtle mechanical typing clicks simulator
        let isRunning = true;
        const playKeyClick = () => {
          if (!isRunning) return;
          try {
            const now = ctx.currentTime;
            const keyOsc = ctx.createOscillator();
            const keyGain = ctx.createGain();
            keyOsc.type = 'sine';
            keyOsc.frequency.setValueAtTime(1200 + Math.random() * 400, now);
            keyGain.gain.setValueAtTime(0.08, now);
            keyGain.gain.exponentialRampToValueAtTime(0.001, now + 0.02);

            keyOsc.connect(keyGain);
            keyGain.connect(channelGain);

            keyOsc.start(now);
            keyOsc.stop(now + 0.02);
          } catch {}

          const nextDelay = 150 + Math.random() * 600;
          setTimeout(playKeyClick, nextDelay);
        };

        playKeyClick();

        stopFn = () => {
          isRunning = false;
        };
        break;
      }

      case 'train': {
        // Rhythmic train track chug-chug pulse
        const osc = ctx.createOscillator();
        osc.type = 'triangle';
        osc.frequency.value = 80;

        const lfo = ctx.createOscillator();
        lfo.type = 'square';
        lfo.frequency.value = 2.5; // 2.5 Hz rhythmic chug

        const lfoGain = ctx.createGain();
        lfoGain.gain.value = 0.5;

        lfo.connect(lfoGain);
        lfoGain.connect(channelGain.gain);

        osc.connect(channelGain);
        osc.start();
        lfo.start();

        stopFn = () => {
          try {
            osc.stop();
            lfo.stop();
          } catch {}
        };
        break;
      }

      case 'birds': {
        // Periodic bird chirps
        let isRunning = true;
        const chirp = () => {
          if (!isRunning) return;
          try {
            const now = ctx.currentTime;
            const chirpOsc = ctx.createOscillator();
            const chirpGain = ctx.createGain();
            chirpOsc.type = 'sine';

            const startFreq = 2000 + Math.random() * 800;
            chirpOsc.frequency.setValueAtTime(startFreq, now);
            chirpOsc.frequency.exponentialRampToValueAtTime(startFreq + 600, now + 0.1);

            chirpGain.gain.setValueAtTime(0.12, now);
            chirpGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

            chirpOsc.connect(chirpGain);
            chirpGain.connect(channelGain);

            chirpOsc.start(now);
            chirpOsc.stop(now + 0.15);
          } catch {}

          const nextChirp = 3000 + Math.random() * 7000;
          setTimeout(chirp, nextChirp);
        };

        chirp();

        stopFn = () => {
          isRunning = false;
        };
        break;
      }

      case 'night': {
        // Cricket chirps + calm night air
        let isRunning = true;
        const cricketChirp = () => {
          if (!isRunning) return;
          try {
            const now = ctx.currentTime;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(4500, now);

            gain.gain.setValueAtTime(0.05, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

            osc.connect(gain);
            gain.connect(channelGain);

            osc.start(now);
            osc.stop(now + 0.08);
          } catch {}

          const nextDelay = 800 + Math.random() * 2000;
          setTimeout(cricketChirp, nextDelay);
        };

        cricketChirp();

        stopFn = () => {
          isRunning = false;
        };
        break;
      }

      default: {
        // Fallback sine wave tone
        const osc = ctx.createOscillator();
        osc.frequency.value = 220;
        osc.connect(channelGain);
        osc.start();
        stopFn = () => {
          try {
            osc.stop();
          } catch {}
        };
        break;
      }
    }

    this.soundChannels.set(soundId, {
      gainNode: channelGain,
      stop: stopFn,
      updateVolume: updateFn,
    });
  }
}
