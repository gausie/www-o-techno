import * as Tone from "tone";

export class SlicerEffect extends Tone.ToneAudioNode {
  private tremolo: Tone.Tremolo;
  private lfo: Tone.LFO;
  private wet: Tone.Gain;
  name = "SlicerEffect";
  input: Tone.ToneAudioNode;
  output: Tone.ToneAudioNode;

  constructor() {
    super();
    // Create a tremolo effect for the amplitude modulation
    this.tremolo = new Tone.Tremolo({
      frequency: 4,
      type: "sine" as Tone.ToneOscillatorType,
      depth: 0.5,
      spread: 0,
    });

    // Create an LFO for more complex modulation shapes
    this.lfo = new Tone.LFO({
      frequency: 4,
      min: 0,
      max: 1,
      type: "sine" as Tone.ToneOscillatorType,
    });

    // Create a wet/dry mixer
    this.wet = new Tone.Gain(0.75);

    // Connect the components
    this.tremolo.connect(this.wet);
    this.lfo.connect(this.wet.gain);

    // Set up input/output
    this.input = this.tremolo;
    this.output = this.wet;
  }

  setMix(mix: number) {
    this.wet.gain.value = mix;
  }

  setWave(wave: number) {
    const waveTypes: Tone.ToneOscillatorType[] = [
      "sine",
      "square",
      "triangle",
      "sawtooth",
    ];
    const type = waveTypes[Math.min(Math.max(Math.floor(wave), 0), 3)];
    this.tremolo.type = type;
    this.lfo.type = type;
  }

  setPhase(phase: number) {
    const degrees = phase * 360;
    this.lfo.phase = degrees;
  }

  setFrequency(freq: number) {
    this.tremolo.frequency.value = freq;
    this.lfo.frequency.value = freq;
  }

  start() {
    this.tremolo.start();
    this.lfo.start();
  }

  stop() {
    this.tremolo.stop();
    this.lfo.stop();
  }
}
