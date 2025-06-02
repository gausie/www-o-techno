import * as Tone from "tone";
import { midiNoteToFrequency } from "./utils";

export class ProphetSynth {
  private synth = new Tone.PolySynth(Tone.Synth, {
    oscillator: {
      type: "sine",
    },
    envelope: {
      attack: 0,
      decay: 1,
      sustain: 0.4,
      release: 1,
    },
  });

  private filter = new Tone.Filter({
    type: "lowpass",
    frequency: midiNoteToFrequency(110),
    Q: 1,
  });

  private reverb = new Tone.Reverb({
    decay: 2.5,
    wet: 0.5,
  });

  private delay = new Tone.FeedbackDelay("8n", 0.3);

  constructor() {
    // Connect the components
    this.synth.chain(this.filter, this.reverb, this.delay).toDestination();
  }

  setCutoff(midiNote: number) {
    // Convert MIDI note to frequency and set as lowpass filter cutoff
    this.filter.frequency.value = midiNoteToFrequency(midiNote);
  }

  triggerAttackRelease(
    note: string | string[],
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

  setReverbDecay(decay: number) {
    this.reverb.decay = decay;
  }

  setReverbWet(wet: number) {
    this.reverb.wet.value = wet;
  }

  setDelayTime(time: string) {
    this.delay.delayTime.value = Tone.Time(time).toSeconds();
  }

  setDelayFeedback(feedback: number) {
    this.delay.feedback.value = feedback;
  }
}
