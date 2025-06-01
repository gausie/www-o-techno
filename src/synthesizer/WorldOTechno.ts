import * as Tone from "tone";
import MersenneTwister from "mersenne-twister";

import { ProphetSynth } from "./ProphetSynth";
import { TB303Synth } from "./TB303Synth";
import { SlicerEffect } from "./SlicerEffect";
import boomUrl from "./samples/bd_boom.wav";
import fatUrl from "./samples/bd_fat.wav";
import hausUrl from "./samples/bd_haus.wav";

export class WorldOTechno {
  static chords = [
    "a1",
    "c1",
    "e1",
    "a2",
    "c2",
    "e2",
    "a3",
    "c3",
    "e3",
    "a4",
    "c4",
    "e4",
  ];
  private tb303 = new TB303Synth();
  private prophet = new ProphetSynth();
  private slicer = new SlicerEffect();

  private positionData = {
    /**
     * Latitude in degrees
     */
    latitude: 52.0382,
    /**
     * Longitude in degrees
     */
    longitude: -2.3799,
    /**
     * Speed in meters per second
     */
    speed: 0.5,
  };

  private samples: Record<string, Tone.Player> = {};
  private loop: Tone.Loop | null = null;

  constructor() {
    // Connect the slicer to the TB303 and destination
    this.tb303.connect(this.slicer.toDestination());
  }

  setPositionData(positionData: {
    latitude: number;
    longitude: number;
    speed: number;
  }) {
    this.positionData = positionData;
  }

  async loadSample(url: string) {
    const request = await fetch(url);
    const arrayBuffer = await request.arrayBuffer();
    const audioBuffer = await Tone.getContext().decodeAudioData(arrayBuffer);
    return new Tone.Player({
      url: audioBuffer,
      volume: 5,
    }).toDestination();
  }

  async load() {
    Tone.getTransport().cancel();

    const [boom, fat, haus] = await Promise.all([
      this.loadSample(boomUrl),
      this.loadSample(fatUrl),
      this.loadSample(hausUrl),
    ]);

    this.samples = { boom, fat, haus };

    if (this.loop) this.loop.dispose();

    this.loop = new Tone.Loop((t) => {
      this.createLoopOne(t); // 8 seconds
      this.createLoopTwo(t + 8); // 4 seconds
      this.createLoopThree(t + 12); // 4 seconds
      this.createLoopFour(t + 16); // 4 seconds
    }, 20).start(0);
  }

  /**
   * Convert latitude to a suitable number, which will vary by about 1 for a sensible small movement
   * One degree is 111325m (at the equator)
   * We'd like to see about a foot, 0.3m, so we'll want a factor of 300000
   * Our GPS report better resolution than that, about 10**-9 degree, but that's not very repeatable
   * @returns Latitude value
   */
  latitudeValue() {
    return Math.round(Math.abs(this.positionData.latitude) * 300000);
  }

  /**
   * Convert longitude to a suitable number, which will vary by about 1 for a sensible small movement
   * One degree is 111325m (at the equator)
   * We'd like to see about a foot, 0.3m, so we'll want a factor of 300000
   * Our GPS report better resolution than that, about 10**-9 degree, but that's not very repeatable
   * @returns Longitude value
   */
  longitudeValue() {
    return Math.round(Math.abs(this.positionData.longitude) * 300000);
  }

  chooseChord(chooser: number) {
    // About 5 feet per chord
    return WorldOTechno.chords[
      Math.floor(chooser / 5) % WorldOTechno.chords.length
    ];
  }

  locationRelease(r: number) {
    // Scale our parameter up or down by a factor of 2 depending on location
    let factor = (this.latitudeValue() + this.longitudeValue()) % 30; // varies from 0 to 30 over distance of 10m
    factor = factor / 30 + 0.5; // varies from 0.5 to 1.5 over 10m
    return r * factor;
  }

  createLoopOne(s: number) {
    new Tone.Loop({
      callback: (t) => {
        this.samples.boom.start(t);
      },
      interval: 0.5,
      iterations: 16,
    }).start(s);

    let i = 0;
    new Tone.Loop({
      callback: (t) => {
        const rng = new MersenneTwister(this.longitudeValue() % 257867);
        const chord = this.chooseChord(this.longitudeValue() % 656753);

        new Tone.Loop({
          callback: (t2) => {
            const release = this.locationRelease(0.1);
            this.tb303.setCutoff(rng.random() * 40 + 50 + (i % 16) * 10);
            this.tb303.triggerAttackRelease(chord, release, t2);
          },
          interval: 0.125,
          iterations: 4,
        }).start(t);
        i++;
      },
      interval: 0.5,
      iterations: 16,
    }).start(s);
  }

  createLoopTwo(s: number) {
    new Tone.Loop({
      callback: (t) => {
        this.samples.fat.start(t);
      },
      interval: 0.5,
      iterations: 8,
    }).start(s);

    let i = 0;
    new Tone.Loop({
      callback: (t) => {
        const rng = new MersenneTwister(this.latitudeValue() % 1412041);
        const chord = this.chooseChord(this.longitudeValue() % 656753);

        new Tone.Loop({
          callback: (t2) => {
            const release = this.locationRelease(0.05);
            const resonance = this.positionData.speed % 1;
            this.tb303.setCutoff(rng.random() * 28 + 70 + (i % 4));
            this.tb303.triggerAttackRelease(chord, release, t2, resonance);
          },
          interval: 0.125,
          iterations: 4,
        }).start(t);

        i++;
      },
      interval: 0.5,
      iterations: 8,
    }).start(s);
  }

  createLoopThree(s: number) {
    new Tone.Loop({
      callback: (t) => {
        this.samples.fat.start(t);
      },
      interval: 0.5,
      iterations: 8,
    }).start(s);

    let i = 0;
    new Tone.Loop({
      callback: (t) => {
        // @todo: rng and chord should actually be frozen for each set of 4 iterations
        const rng = new MersenneTwister(
          (this.longitudeValue() + this.latitudeValue()) % 2256197,
        );
        const chord = this.chooseChord(this.latitudeValue() % 656753);

        // Set reverb mix that gradually increases
        this.prophet.setReverbWet(
          0.3 + ((i % 4) % 8 === 0 && i % 4 !== 0 ? 0.5 * ((i % 4) / 32) : 0),
        );
        this.prophet.setCutoff(rng.random() * 18 + 70 + (i % 4));
        this.prophet.triggerAttackRelease(chord, this.locationRelease(0.08), t);
        i++;
      },
      interval: 0.125,
      iterations: 32,
    }).start(s);
  }

  createLoopFour(s: number) {
    new Tone.Loop({
      callback: (t) => {
        this.samples.fat.start(t);
      },
      interval: 1,
      iterations: 4,
    }).start(s);

    new Tone.Loop({
      callback: (t) => {
        // @todo: rng, chord and slicer should actually be frozen for each set of 4 iterations
        const rng = new MersenneTwister(this.longitudeValue() % 9562447);
        const chord = this.chooseChord(this.longitudeValue() % 656753);
        // Configure slicer effect
        const slat = this.latitudeValue() + 0.1;
        this.slicer.setMix(0.75);
        this.slicer.setWave(3);
        this.slicer.setPhase(slat);
        this.slicer.start();
        this.tb303.setCutoff(rng.random() * 50 + 50);
        this.tb303.triggerAttackRelease(chord, this.locationRelease(0.1), t);
        this.slicer.stop();
      },
      interval: 0.25,
      iterations: 16,
    }).start(s);
  }

  play() {
    Tone.getTransport().start();
  }

  pause() {
    Tone.getTransport().stop();
  }
}
