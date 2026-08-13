export class AudioSynthService {
  private static ctx: AudioContext | null = null;
  private static activeSynthNodes: {
    oscillators: OscillatorNode[];
    gain: GainNode;
    filter?: BiquadFilterNode;
    noiseNode?: AudioBufferSourceNode;
  } | null = null;

  private static getContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  // UI Sound Effects
  static playClickSound(): void {
    try {
      const ctx = this.getContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch {
      // Audio context blocked or unsupported
    }
  }

  static playSuccessSound(): void {
    this.playXpGainSound();
  }

  static playNotificationSound(): void {
    try {
      const ctx = this.getContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.1);

      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } catch {
      // Audio context blocked
    }
  }

  static playXpGainSound(): void {
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6

      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.06);

        gain.gain.setValueAtTime(0.15, now + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.15);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.06);
        osc.stop(now + idx * 0.06 + 0.15);
      });
    } catch {
      // Audio context blocked
    }
  }

  static playLevelUpSound(): void {
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;
      const arpeggio = [440, 554.37, 659.25, 880, 1108.73, 1318.51]; // A major fan fare

      arpeggio.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        gain.gain.setValueAtTime(0.1, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.3);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.3);
      });
    } catch {
      // Audio context blocked
    }
  }

  // Ambient Focus Generator
  static startSynthPreset(
    preset: 'rain' | 'binaural' | 'cyber' | 'deepfocus' | 'lofiChords' | 'ocean' | 'fireplace' | 'librarySilence' | 'coffeeRain' | 'animeCafeLofi',
    volume: number = 0.5
  ): { stop: () => void; setVolume: (v: number) => void } {
    this.stopCurrentSynth();
    const ctx = this.getContext();
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(volume * 0.3, ctx.currentTime);
    masterGain.connect(ctx.destination);

    const oscillators: OscillatorNode[] = [];
    let noiseNode: AudioBufferSourceNode | undefined;

    if (preset === 'rain' || preset === 'coffeeRain') {
      // Pink Noise for Rain Simulation + Coffee Shop Ambience
      const bufferSize = ctx.sampleRate * 2;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
        output[i] *= 0.11;
        b6 = white * 0.115926;
      }

      noiseNode = ctx.createBufferSource();
      noiseNode.buffer = noiseBuffer;
      noiseNode.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = preset === 'coffeeRain' ? 950 : 1200;

      noiseNode.connect(filter);
      filter.connect(masterGain);
      noiseNode.start();

      if (preset === 'coffeeRain') {
        // Soft ambient warm hum for coffee shop atmosphere
        const osc1 = ctx.createOscillator();
        osc1.type = 'sine';
        osc1.frequency.value = 130.81; // C3
        const gain1 = ctx.createGain();
        gain1.gain.value = 0.15;
        osc1.connect(gain1);
        gain1.connect(masterGain);
        osc1.start();
        oscillators.push(osc1);
      }
    } else if (preset === 'librarySilence') {
      // Library Silence: Ultra-quiet filtered room noise + 432Hz focus harmonic
      const bufferSize = ctx.sampleRate * 2;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = (Math.random() * 2 - 1) * 0.02; // Very quiet white noise
      }

      noiseNode = ctx.createBufferSource();
      noiseNode.buffer = noiseBuffer;
      noiseNode.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 400; // Muffled room acoustics

      noiseNode.connect(filter);
      filter.connect(masterGain);
      noiseNode.start();

      // 432Hz gentle harmonic sine for library deep focus
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = 432;
      const gain = ctx.createGain();
      gain.gain.value = 0.04;
      osc.connect(gain);
      gain.connect(masterGain);
      osc.start();
      oscillators.push(osc);
    } else if (preset === 'animeCafeLofi' || preset === 'lofiChords') {
      // Anime Cafe Lo-Fi: Warm Jazzy 7th Chords (Cmaj9 / Am9)
      const freqs = [261.63, 329.63, 392.00, 493.88, 587.33]; // C4, E4, G4, B4, D5
      freqs.forEach((f) => {
        const osc = ctx.createOscillator();
        osc.type = 'triangle';
        osc.frequency.value = f;

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 800; // Warm lofi filter

        osc.connect(filter);
        filter.connect(masterGain);
        osc.start();
        oscillators.push(osc);
      });
    } else if (preset === 'binaural') {
      // Alpha Wave 10Hz binaural beats (200Hz Left, 210Hz Right)
      const oscL = ctx.createOscillator();
      const oscR = ctx.createOscillator();

      oscL.type = 'sine';
      oscR.type = 'sine';

      oscL.frequency.value = 200;
      oscR.frequency.value = 210;

      oscL.connect(masterGain);
      oscR.connect(masterGain);

      oscL.start();
      oscR.start();

      oscillators.push(oscL, oscR);
    } else if (preset === 'cyber') {
      // Cyberpunk Sawtooth Synth Drone with LFO Filter
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();

      osc1.type = 'sawtooth';
      osc2.type = 'sawtooth';

      osc1.frequency.value = 110; // A2
      osc2.frequency.value = 110.5; // Slight detune

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 400;

      // LFO for filter sweep
      const lfo = ctx.createOscillator();
      lfo.frequency.value = 0.2; // 0.2 Hz slow pulse
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 300;

      lfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(masterGain);

      lfo.start();
      osc1.start();
      osc2.start();

      oscillators.push(osc1, osc2, lfo);
    } else if (preset === 'deepfocus') {
      // Deep Sub Drone + Soft Sine Warmth
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();

      osc1.type = 'sine';
      osc2.type = 'triangle';

      osc1.frequency.value = 65.41; // C2
      osc2.frequency.value = 130.81; // C3

      osc1.connect(masterGain);
      osc2.connect(masterGain);

      osc1.start();
      osc2.start();

      oscillators.push(osc1, osc2);
    } else {
      // Lofi Chords Ambient Warmth
      const freqs = [261.63, 329.63, 392.00, 493.88]; // Cmaj7 (C4, E4, G4, B4)
      freqs.forEach((f) => {
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.value = f;
        osc.connect(masterGain);
        osc.start();
        oscillators.push(osc);
      });
    }

    this.activeSynthNodes = {
      oscillators,
      gain: masterGain,
      noiseNode,
    };

    return {
      stop: () => this.stopCurrentSynth(),
      setVolume: (v: number) => {
        if (this.activeSynthNodes) {
          this.activeSynthNodes.gain.gain.setValueAtTime(v * 0.3, ctx.currentTime);
        }
      },
    };
  }

  static stopCurrentSynth(): void {
    if (this.activeSynthNodes) {
      this.activeSynthNodes.oscillators.forEach((o) => {
        try {
          o.stop();
        } catch {
          // ignore
        }
      });
      if (this.activeSynthNodes.noiseNode) {
        try {
          this.activeSynthNodes.noiseNode.stop();
        } catch {
          // ignore
        }
      }
      this.activeSynthNodes = null;
    }
  }
}
