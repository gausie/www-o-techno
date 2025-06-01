export const midiNoteToFrequency = (noteNumber: number) =>
  440 * Math.pow(2, (noteNumber - 69) / 12);
