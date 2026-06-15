import { useRef, useCallback, useEffect } from 'react';
import { SoundType } from '@/types';

let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioContext;
}

function playElectronicSound(ctx: AudioContext, volume: number) {
  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();
  const filter = ctx.createBiquadFilter();

  oscillator.type = 'square';
  oscillator.frequency.setValueAtTime(880, ctx.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + 0.15);

  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(2000, ctx.currentTime);

  gainNode.gain.setValueAtTime(0, ctx.currentTime);
  gainNode.gain.linearRampToValueAtTime(volume * 0.3, ctx.currentTime + 0.01);
  gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);

  oscillator.connect(filter);
  filter.connect(gainNode);
  gainNode.connect(ctx.destination);

  oscillator.start(ctx.currentTime);
  oscillator.stop(ctx.currentTime + 0.2);
}

function playWoodenSound(ctx: AudioContext, volume: number) {
  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();

  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(350, ctx.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.1);

  gainNode.gain.setValueAtTime(0, ctx.currentTime);
  gainNode.gain.linearRampToValueAtTime(volume * 0.5, ctx.currentTime + 0.005);
  gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);

  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);

  oscillator.start(ctx.currentTime);
  oscillator.stop(ctx.currentTime + 0.15);
}

function playSynthSound(ctx: AudioContext, volume: number) {
  const osc1 = ctx.createOscillator();
  const osc2 = ctx.createOscillator();
  const gainNode = ctx.createGain();
  const delay = ctx.createDelay(0.3);
  const feedback = ctx.createGain();

  osc1.type = 'sawtooth';
  osc2.type = 'sawtooth';
  osc1.frequency.setValueAtTime(440, ctx.currentTime);
  osc2.frequency.setValueAtTime(441, ctx.currentTime);

  delay.delayTime.setValueAtTime(0.15, ctx.currentTime);
  feedback.gain.setValueAtTime(0.3, ctx.currentTime);

  gainNode.gain.setValueAtTime(0, ctx.currentTime);
  gainNode.gain.linearRampToValueAtTime(volume * 0.2, ctx.currentTime + 0.01);
  gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);

  osc1.connect(gainNode);
  osc2.connect(gainNode);
  gainNode.connect(delay);
  delay.connect(feedback);
  feedback.connect(delay);
  delay.connect(ctx.destination);
  gainNode.connect(ctx.destination);

  osc1.start(ctx.currentTime);
  osc2.start(ctx.currentTime);
  osc1.stop(ctx.currentTime + 0.3);
  osc2.stop(ctx.currentTime + 0.3);
}

function playDrumSound(ctx: AudioContext, volume: number) {
  const noise = ctx.createBufferSource();
  const buffer = ctx.createBuffer(1, ctx.sampleRate * 0.2, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.05));
  }
  noise.buffer = buffer;

  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(800, ctx.currentTime);

  const gainNode = ctx.createGain();
  gainNode.gain.setValueAtTime(volume * 0.4, ctx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);

  noise.connect(filter);
  filter.connect(gainNode);
  gainNode.connect(ctx.destination);

  noise.start(ctx.currentTime);
  noise.stop(ctx.currentTime + 0.2);
}

export function useAudio() {
  const isPlayingRef = useRef(false);

  const playSound = useCallback((type: SoundType, volume: number = 0.5) => {
    if (isPlayingRef.current) return;
    isPlayingRef.current = true;

    try {
      const ctx = getAudioContext();
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      switch (type) {
        case 'electronic':
          playElectronicSound(ctx, volume);
          break;
        case 'wooden':
          playWoodenSound(ctx, volume);
          break;
        case 'synth':
          playSynthSound(ctx, volume);
          break;
        case 'drum':
          playDrumSound(ctx, volume);
          break;
      }
    } catch (e) {
      console.warn('Audio playback failed:', e);
    }

    setTimeout(() => {
      isPlayingRef.current = false;
    }, 50);
  }, []);

  useEffect(() => {
    const handleInteraction = () => {
      try {
        const ctx = getAudioContext();
        if (ctx.state === 'suspended') {
          ctx.resume();
        }
      } catch (e) {
        console.warn(e);
      }
    };

    document.addEventListener('click', handleInteraction, { once: true });
    document.addEventListener('touchstart', handleInteraction, { once: true });
    document.addEventListener('keydown', handleInteraction, { once: true });

    return () => {
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('touchstart', handleInteraction);
      document.removeEventListener('keydown', handleInteraction);
    };
  }, []);

  return { playSound };
}
