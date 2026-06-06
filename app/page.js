"use client";

import Lenis from "lenis";
import { useEffect, useMemo, useRef, useState } from "react";

const BACKEND_URL = (process.env.NEXT_PUBLIC_BACKEND_URL || "").replace(/\/$/, "");
const MAX_VIDEO_SIZE = 100 * 1024 * 1024;
const MAX_AUDIO_SIZE = 50 * 1024 * 1024;
const MAX_TEXT_LENGTH = 5000;
const SAFE_ERROR_MESSAGES = new Set([
  "Invalid File Type",
  "File Too Large",
  "Processing Failed",
  "Service Unavailable",
  "Backend URL is missing.",
  "Backend Offline"
]);
const LANGUAGES = [
  "English",
  "Spanish",
  "French",
  "German",
  "Italian",
  "Portuguese",
  "Polish",
  "Turkish",
  "Russian",
  "Dutch",
  "Czech",
  "Arabic",
  "Chinese",
  "Japanese",
  "Hungarian",
  "Korean",
  "Hindi"
];
const RUN_STATES = ["Idle", "Uploading", "Processing", "Success"];

const modes = [
  {
    id: "video",
    label: "Video Dubbing",
    endpoint: "/dub-video",
    fileField: "video",
    fileLabel: "Video File",
    languageField: "target_language",
    languageLabel: "Target Language",
    allowedExtensions: [".mp4", ".mov", ".mkv", ".webm", ".avi"],
    responseMimePrefixes: ["video/"],
    maxSize: MAX_VIDEO_SIZE,
    downloadName: "video_dubbed.mp4",
    outputLabel: "video",
    processingText: "Processing video..."
  },
  {
    id: "audio",
    label: "Audio Dubbing",
    endpoint: "/dub-audio",
    fileField: "audio",
    fileLabel: "Audio File",
    languageField: "target_language",
    languageLabel: "Target Language",
    allowedExtensions: [".wav", ".mp3", ".m4a", ".flac", ".ogg"],
    responseMimePrefixes: ["audio/"],
    maxSize: MAX_AUDIO_SIZE,
    downloadName: "audio_dubbed.wav",
    outputLabel: "WAV",
    processingText: "Processing audio..."
  },
  {
    id: "clone",
    label: "Voice Clone",
    endpoint: "/voice-clone",
    fileField: "reference_audio",
    fileLabel: "Reference Audio",
    allowedExtensions: [".wav", ".mp3", ".m4a", ".flac", ".ogg"],
    responseMimePrefixes: ["audio/"],
    maxSize: MAX_AUDIO_SIZE,
    downloadName: "voice_clone.wav",
    outputLabel: "WAV",
    processingText: "Generating voice..."
  }
];

const initialForm = {
  file: null,
  targetLanguage: "",
  text: ""
};

export default function Home() {
  const [modeId, setModeId] = useState("clone");
  const [form, setForm] = useState(initialForm);
  const [state, setState] = useState("Idle");
  const [statusText, setStatusText] = useState("Ready");
  const [error, setError] = useState("");
  const [backendStatus, setBackendStatus] = useState("Checking");
  const [isDragging, setIsDragging] = useState(false);
  const [fileInputKey, setFileInputKey] = useState(0);
  const fileInputRef = useRef(null);

  const mode = useMemo(() => modes.find((item) => item.id === modeId), [modeId]);
  const acceptValue = mode.allowedExtensions.join(",");
  const isBusy = state === "Uploading" || state === "Processing";
  const submitLabel = isBusy ? "Working..." : mode.id === "video" ? "Generate Video" : "Generate WAV";

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.1,
      easing: (time) => 1 - Math.pow(1 - time, 3),
      smoothWheel: true,
      wheelMultiplier: 0.85
    });
    let frameId;

    function raf(time) {
      lenis.raf(time);
      frameId = requestAnimationFrame(raf);
    }

    frameId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frameId);
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
    const revealItems = document.querySelectorAll("[data-reveal]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.18 }
    );

    revealItems.forEach((item) => observer.observe(item));

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let active = true;

    async function checkHealth() {
      if (!BACKEND_URL) {
        setBackendStatus("Backend Offline");
        return;
      }

      try {
        const response = await fetch(`${BACKEND_URL}/health`, { method: "GET" });
        if (active) {
          setBackendStatus(response.ok ? "Backend Online" : "Backend Offline");
        }
      } catch {
        if (active) {
          setBackendStatus("Backend Offline");
        }
      }
    }

    checkHealth();

    return () => {
      active = false;
    };
  }, []);

  function updateForm(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function getFileExtension(fileName) {
    const normalizedName = fileName.toLowerCase();
    const dotIndex = normalizedName.lastIndexOf(".");
    return dotIndex >= 0 ? normalizedName.slice(dotIndex) : "";
  }

  function formatBytes(bytes) {
    const megabytes = bytes / (1024 * 1024);
    return `${Math.round(megabytes)} MB`;
  }

  function sanitizeErrorMessage(message) {
    if (!message) {
      return "Processing Failed";
    }

    const singleLine = String(message).replace(/[\r\n\t]+/g, " ").trim();
    const compact = singleLine.slice(0, 140);

    if (SAFE_ERROR_MESSAGES.has(compact)) {
      return compact;
    }

    if (/file too large/i.test(compact)) {
      return "File Too Large";
    }

    if (/invalid file|unsupported file|file type/i.test(compact)) {
      return "Invalid File Type";
    }

    if (/unavailable|timeout|network|failed to fetch/i.test(compact)) {
      return "Service Unavailable";
    }

    return "Processing Failed";
  }

  function validateFile(file, currentMode) {
    if (!file) {
      return "Please choose a supported file.";
    }

    const extension = getFileExtension(file.name);
    if (!currentMode.allowedExtensions.includes(extension)) {
      return `Invalid File Type. Allowed: ${currentMode.allowedExtensions.join(", ")}`;
    }

    if (file.size <= 0) {
      return "Invalid File Type";
    }

    if (file.size > currentMode.maxSize) {
      return `File Too Large. Maximum size is ${formatBytes(currentMode.maxSize)}.`;
    }

    return "";
  }

  function validateInputs() {
    const fileError = validateFile(form.file, mode);
    if (fileError) {
      return fileError;
    }

    if (mode.id !== "clone" && !LANGUAGES.includes(form.targetLanguage)) {
      return "Choose a target language.";
    }

    if (mode.id === "clone") {
      const trimmedText = form.text.trim();
      if (!trimmedText) {
        return "Enter text for voice cloning.";
      }

      if (trimmedText.length > MAX_TEXT_LENGTH) {
        return `Text is too long. Maximum length is ${MAX_TEXT_LENGTH} characters.`;
      }
    }

    return "";
  }

  function switchMode(nextMode) {
    setModeId(nextMode);
    setForm(initialForm);
    setState("Idle");
    setStatusText("Ready");
    setError("");
    setIsDragging(false);
    setFileInputKey((current) => current + 1);
  }

  function handleFileSelection(nextFile) {
    const fileError = nextFile ? validateFile(nextFile, mode) : "";
    updateForm("file", nextFile);
    setError(fileError);
    setState(fileError ? "Failed" : "Idle");
    setStatusText(fileError || (nextFile ? "File ready" : "Ready"));
  }

  function clearFile(event) {
    event.stopPropagation();
    updateForm("file", null);
    setError("");
    setState("Idle");
    setStatusText("Ready");
    setFileInputKey((current) => current + 1);
  }

  async function readError(response) {
    const contentType = response.headers.get("content-type") || "";

    try {
      if (contentType.includes("application/json")) {
        const data = await response.json();
        return sanitizeErrorMessage(data.error || data.message);
      }

      const text = await response.text();
      return sanitizeErrorMessage(text);
    } catch {
      return "Processing Failed";
    }
  }

  function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  function isExpectedResponseBlob(blob, currentMode) {
    if (!blob.type || blob.type === "application/octet-stream") {
      return true;
    }

    return currentMode.responseMimePrefixes.some((prefix) => blob.type.startsWith(prefix));
  }

  function openFileDialog() {
    if (!isBusy) {
      fileInputRef.current?.click();
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!BACKEND_URL) {
      setState("Failed");
      setStatusText("Backend URL is missing.");
      setError(sanitizeErrorMessage("Backend URL is missing."));
      return;
    }

    const validationError = validateInputs();
    if (validationError) {
      setState("Failed");
      setStatusText(validationError.startsWith("File Too Large") ? "File Too Large" : "Invalid input");
      setError(validationError);
      return;
    }

    const formData = new FormData();
    formData.append(mode.fileField, form.file);

    if (mode.id !== "clone") {
      formData.append(mode.languageField, form.targetLanguage);
    }

    if (mode.id === "clone") {
      formData.append("text", form.text.trim());
    }

    try {
      setState("Uploading");
      setStatusText("Uploading file...");

      setState("Processing");
      setStatusText(mode.processingText);

      const response = await fetch(`${BACKEND_URL}${mode.endpoint}`, {
        method: "POST",
        body: formData
      });

      if (!response.ok) {
        throw new Error(await readError(response));
      }

      const blob = await response.blob();
      if (!isExpectedResponseBlob(blob, mode)) {
        throw new Error("Processing Failed");
      }

      setStatusText("Downloading result...");
      downloadBlob(blob, mode.downloadName);
      setState("Success");
      setStatusText(`${mode.outputLabel} downloaded`);
    } catch (requestError) {
      setState("Failed");
      setStatusText("Failed");
      setError(sanitizeErrorMessage(requestError.message));
    }
  }

  return (
    <main className="app-shell">
      <section className="hero" data-reveal>
        <div className="hero-image" aria-hidden="true" />
        <nav className="nav-bar">
          <a className="brand" href="#top" aria-label="VoiceFront home">
            VoiceFront
          </a>
          <div className="nav-links">
            <a href="https://huggingface.co/spaces/swayamshetkar/Vdub-orchestrator" target="_blank" rel="noopener noreferrer" title="Hugging Face Backend">
              🤗 Backend Repo
            </a>
            <a href="https://github.com/swayamshetkar/VoiceClone-Frontend" target="_blank" rel="noopener noreferrer" title="GitHub Repository">
              Frontend Repo
            </a>
          </div>
          <div className={`health ${backendStatus === "Backend Online" ? "online" : "offline"}`}>
            <span />
            {backendStatus}
          </div>
        </nav>

        <div className="hero-grid" id="top">
          <div className="hero-copy">
            <p className="eyebrow">Main backend only</p>
            <h1>Dub video, translate audio, clone voice.</h1>
            <p className="hero-text">
              A focused upload studio for localization jobs, clean downloads, and a smoother wait while the backend does the heavy lifting.
            </p>
            <div className="hero-actions">
              <a href="#studio">Start a job</a>
              <a href="#motion">View flow</a>
            </div>
            <div className="spec-row" aria-label="Upload limits">
              <span>100 MB video</span>
              <span>50 MB audio</span>
              <span>Direct backend calls</span>
            </div>
          </div>

          <form className="tool-panel" id="studio" onSubmit={handleSubmit} data-reveal>
            <div className="panel-heading">
              <div>
                <p className="eyebrow">Create</p>
                <h2>{mode.label}</h2>
              </div>
              <span className={`state-pill ${state.toLowerCase()}`}>{state}</span>
            </div>

            <div className="mode-tabs" role="tablist" aria-label="Application modes">
              {modes.map((item) => (
                <button
                  aria-selected={item.id === modeId}
                  className={item.id === modeId ? "active" : ""}
                  disabled={isBusy}
                  key={item.id}
                  onClick={() => switchMode(item.id)}
                  role="tab"
                  type="button"
                >
                  {item.label}
                </button>
              ))}
            </div>

            <input
              accept={acceptValue}
              className="visually-hidden"
              disabled={isBusy}
              key={fileInputKey}
              onChange={(event) => handleFileSelection(event.target.files?.[0] || null)}
              ref={fileInputRef}
              type="file"
            />

            <div
              className={`dropzone ${isDragging ? "dragging" : ""} ${form.file ? "has-file" : ""}`}
              onClick={openFileDialog}
              onDragEnter={(event) => {
                event.preventDefault();
                if (!isBusy) {
                  setIsDragging(true);
                }
              }}
              onDragLeave={(event) => {
                event.preventDefault();
                setIsDragging(false);
              }}
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => {
                event.preventDefault();
                setIsDragging(false);
                if (!isBusy) {
                  handleFileSelection(event.dataTransfer.files?.[0] || null);
                }
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  openFileDialog();
                }
              }}
              role="button"
              tabIndex={0}
            >
              <span className="drop-icon">+</span>
              <div>
                <strong>{form.file ? form.file.name : mode.fileLabel}</strong>
                <p>
                  {form.file
                    ? `${formatBytes(form.file.size)} selected`
                    : `Drop or browse ${mode.allowedExtensions.join(", ")}`}
                </p>
              </div>
              {form.file && (
                <button className="clear-file" disabled={isBusy} onClick={clearFile} type="button">
                  Remove
                </button>
              )}
            </div>

            {mode.id !== "clone" && (
              <label>
                <span>{mode.languageLabel}</span>
                <select
                  disabled={isBusy}
                  onChange={(event) => updateForm("targetLanguage", event.target.value)}
                  required
                  value={form.targetLanguage}
                >
                  <option value="" disabled>
                    Select language
                  </option>
                  {LANGUAGES.map((language) => (
                    <option key={language} value={language}>
                      {language}
                    </option>
                  ))}
                </select>
              </label>
            )}

            {mode.id === "clone" && (
              <label>
                <span>Text</span>
                <textarea
                  disabled={isBusy}
                  maxLength={MAX_TEXT_LENGTH}
                  onChange={(event) => updateForm("text", event.target.value)}
                  placeholder="Enter text to synthesize"
                  required
                  rows={5}
                  value={form.text}
                />
              </label>
            )}

            {mode.id === "video" && (
              <>
                <p className="testing-warning">⚠️ Video Dubbing is in testing phase. Results may be inappropriate.</p>
                <p className="estimate-note">Final video generation usually takes around 5 minutes.</p>
              </>
            )}

            {mode.id === "audio" && (
              <p className="testing-warning">⚠️ Audio Dubbing is in testing phase. Results may be inappropriate.</p>
            )}

            <div className="progress-track" aria-label="Processing states">
              {RUN_STATES.map((item) => (
                <span
                  className={
                    item === state || (state === "Failed" && item === "Processing") ? "active" : ""
                  }
                  key={item}
                >
                  {item}
                </span>
              ))}
            </div>

            <div className="status-row">
              <div>
                <span className="state-label">Status</span>
                <strong>{statusText}</strong>
              </div>
              <button disabled={isBusy} type="submit">
                {submitLabel}
              </button>
            </div>

            {error && <p className="error-message">{error}</p>}
          </form>
        </div>
      </section>

      <section className="motion-section" id="motion" data-reveal>
        <div className="motion-copy">
          <p className="eyebrow">Flow</p>
          <h2>Upload, wait, download.</h2>
          <p>
            The interface stays lightweight while the Main Backend handles validation, conversion, orchestration, and final media output.
          </p>
        </div>
        <div className="media-ribbon" aria-hidden="true">
          <video
            autoPlay
            className="transition-video"
            loop
            muted
            playsInline
            poster="/assets/dubbing-studio-hero.png"
          >
            <source src="/assets/studio-transition.mp4" type="video/mp4" />
          </video>
          <div className="media-frame frame-one" />
          <div className="media-frame frame-two" />
          <div className="media-frame frame-three" />
          <div className="wave-card">
            <span />
            <span />
            <span />
            <span />
            <span />
          </div>
        </div>
      </section>
    </main>
  );
}
