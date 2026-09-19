/**
 * Web Speech API Service for Senior Accessibility & Voice Input
 */

// Text To Speech
export function speakText(text: string, rate: number = 0.9): void {
  if (!('speechSynthesis' in window)) {
    console.warn('Text-to-Speech is not supported in this browser.');
    return;
  }

  window.speechSynthesis.cancel(); // Cancel any ongoing speech
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = rate;
  utterance.pitch = 1.0;
  utterance.volume = 1.0;
  
  // Pick friendly English voice if available
  const voices = window.speechSynthesis.getVoices();
  const englishVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha')));
  if (englishVoice) {
    utterance.voice = englishVoice;
  }

  window.speechSynthesis.speak(utterance);
}

export function stopSpeaking(): void {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

// Speech To Text (Voice Input)
export function listenToVoiceInput(
  onResult: (transcript: string) => void,
  onEnd?: () => void,
  onError?: (error: string) => void
): () => void {
  const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

  if (!SpeechRecognition) {
    if (onError) onError('Voice input is not supported in this browser. Please try Chrome or Safari.');
    return () => {};
  }

  const recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = 'en-US';

  recognition.onresult = (event: any) => {
    const transcript = event.results[0][0].transcript;
    onResult(transcript);
  };

  recognition.onerror = (event: any) => {
    if (onError) onError(event.error || 'Could not recognize voice.');
  };

  recognition.onend = () => {
    if (onEnd) onEnd();
  };

  recognition.start();

  return () => {
    try {
      recognition.stop();
    } catch (e) {
      // ignore
    }
  };
}
