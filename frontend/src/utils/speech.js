// src/utils/speech.js
export function speak(text) {
  if (!window.speechSynthesis) {
    console.error("Speech synthesis not supported");
    return;
  }

  let voices = window.speechSynthesis.getVoices();
  if (!voices.length) {
    const handleVoicesChanged = () => {
      const loaded = window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = null; // tear down
      _doSpeak(text, loaded);
    };
    window.speechSynthesis.onvoiceschanged = handleVoicesChanged;
    return;
  }

  _doSpeak(text, voices);

  function _doSpeak(msg, availableVoices) {
    const utter = new SpeechSynthesisUtterance(msg);

    const chosen =
      availableVoices.find((v) => v.name.includes("Microsoft Zira")) ||
      availableVoices.find((v) => v.name.includes("Google UK English Male")) ||
      availableVoices[0];

    utter.voice = chosen;
    utter.pitch = 0.5; 
    utter.rate = 1.0; 
    utter.lang = chosen.lang || "en-US";

    window.speechSynthesis.speak(utter);
  }
}
