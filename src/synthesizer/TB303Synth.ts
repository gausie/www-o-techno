import * as Tone from "tone";
import { midiNoteToFrequency } from "./utils";

export class TB303Synth {
  private synth = new Tone.MonoSynth({
    oscillator: {
      type: "sawtooth",
    },
    envelope: {
      attack: 0.01,
      decay: 0.1,
      sustain: 0.5,
      release: 0.1,
    },
  });
  private filter = new Tone.Filter({
    type: "lowpass",
    frequency: 1000,
    Q: 1,
  });
  private distortion = new Tone.Distortion(0.3);
  private delay = new Tone.FeedbackDelay("8n", 0.3);
  private cutoff = new Tone.Filter({
    type: "highpass",
    frequency: midiNoteToFrequency(100),
    Q: 1,
  });

  constructor() {
    // Connect the components
    this.synth
      .chain(this.filter, this.distortion, this.delay, this.cutoff)
      .toDestination();
  }

  connect(node: Tone.ToneAudioNode) {
    this.cutoff.disconnect();
    this.cutoff.connect(node);
  }

  setCutoff(midiNote: number) {
    this.cutoff.frequency.value = midiNoteToFrequency(midiNote);
  }

  triggerAttackRelease(
    note: string,
    duration: Tone.Unit.Time,
    time?: Tone.Unit.Time,
    velocity?: number,
  ) {
    this.synth.triggerAttackRelease(note, duration, time, velocity);
  }

  setFilterFreq(freq: number) {
    this.filter.frequency.value = freq;
  }

  setFilterQ(q: number) {
    this.filter.Q.value = q;
  }

  setDistortion(amount: number) {
    this.distortion.distortion = amount;
  }

  setDelayTime(time: string) {
    this.delay.delayTime.value = Tone.Time(time).toSeconds();
  }

  setDelayFeedback(feedback: number) {
    this.delay.feedback.value = feedback;
  }
}
