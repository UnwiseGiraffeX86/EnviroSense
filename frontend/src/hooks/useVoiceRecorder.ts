import { useState, useRef, useCallback } from 'react';

export function useVoiceRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isTranscribing, setIsTranscribing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // Use a supported mime type if possible, or default
      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus") 
        ? "audio/webm;codecs=opus" 
        : "audio/webm";
      
      mediaRecorderRef.current = new MediaRecorder(stream, { mimeType });
      chunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      alert("Could not access microphone. Please check permissions.");
    }
  }, []);

  const stopRecording = useCallback(async () => {
    if (!mediaRecorderRef.current) return;

    return new Promise<void>((resolve) => {
      mediaRecorderRef.current!.onstop = async () => {
        const mimeType = mediaRecorderRef.current?.mimeType || 'audio/webm';
        const audioBlob = new Blob(chunksRef.current, { type: mimeType });
        setIsRecording(false);
        
        // Stop all tracks to release microphone
        mediaRecorderRef.current?.stream.getTracks().forEach(track => track.stop());

        if (audioBlob.size < 2000) { // Ignore recordings smaller than ~2KB (too short)
            console.warn("Recording too short, ignoring.");
            resolve();
            return;
        }

        // Send to API
        setIsTranscribing(true);
        try {
          const formData = new FormData();
          // Ensure filename has correct extension for the mime type
          const ext = mimeType.includes('mp4') ? 'm4a' : 'webm';
          formData.append("file", audioBlob, `recording.${ext}`);

          const response = await fetch("/api/transcribe", {
            method: "POST",
            body: formData,
          });

          const data = await response.json();
          if (data.text) {
            setTranscript(prev => prev ? prev + " " + data.text : data.text);
          } else if (data.error) {
            console.error("Transcription error:", data.error);
          }
        } catch (error) {
          console.error("Failed to transcribe:", error);
        } finally {
          setIsTranscribing(false);
          resolve();
        }
      };

      mediaRecorderRef.current!.stop();
    });
  }, []);

  return {
    isRecording,
    transcript,
    setTranscript,
    isTranscribing,
    startRecording,
    stopRecording
  };
}
