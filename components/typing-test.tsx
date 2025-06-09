"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useTypingStore } from "@/lib/store";
import { Edit, X, Save, Sparkles, Trash2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  generateWords,
  generateQuote,
  generateCode,
  generateNepaliWords,
  generateNepaliQuote,
} from "@/lib/text-generator";
import { cn } from "@/lib/utils";
import { Play, RotateCcw, Timer, Target, BookOpen } from "lucide-react";

export function TypingTest() {
  const {
    testMode,
    timeLimit,
    wordCount,
    isTestActive,
    isTestComplete,
    currentText,
    userInput,
    currentWordIndex,
    currentCharIndex,
    wpm,
    accuracy,
    errors,
    timeRemaining,
    startTest,
    resetTest,
    updateInput,
    setCurrentText,
    setTimeLimit,
    setWordCount,
    setTestMode,
  } = useTypingStore();

  const inputRef = useRef<HTMLInputElement>(null);
  const [focusedInput, setFocusedInput] = useState(false);
  const [customText, setCustomText] = useState("The quick brown fox jumps over the lazy dog.");
  const [isEditingCustomText, setIsEditingCustomText] = useState(false);

  // Check if current mode is Nepali
  const isNepaliMode = testMode === "nepali-words" || testMode === "nepali-quotes";

  // Generate text based on mode
  useEffect(() => {
    const generateText = async () => {
      let text = "";
      switch (testMode) {
        case "words":
          text = generateWords(wordCount);
          break;
        case "quotes":
          text = await generateQuote();
          break;
        case "code":
          text = generateCode();
          break;
        case "nepali-words":
          text = generateNepaliWords(wordCount);
          break;
        case "nepali-quotes":
          text = await generateNepaliQuote();
          break;
        case "custom":
          text = customText.trim();
          break;
        default:
          text = generateWords(wordCount);
      }
      setCurrentText(text);
    };

    if (!isTestActive) {
      generateText();
    }
  }, [testMode, wordCount, customText, isTestActive, setCurrentText]);

  // Focus input when test starts
  useEffect(() => {
    if (isTestActive && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isTestActive]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isTestActive) {
      startTest();
    }
    updateInput(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Tab") {
      e.preventDefault();
      if (!isTestActive) {
        startTest();
      }
    }
  };

  const handleCustomTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCustomText(e.target.value);
  };

  const saveCustomText = () => {
    if (customText.trim() === "") {
      alert("Custom text cannot be empty");
      return;
    }
    setIsEditingCustomText(false);
    setCurrentText(customText.trim());
  };

  // Improved Nepali text splitting and rendering
  const words = currentText.split(/\s+/g).filter((word) => word.length > 0);
  const currentWord = words[currentWordIndex] || "";
  const typedWord = userInput.split(/\s+/g)[currentWordIndex] || "";

  const renderWord = (word: string, wordIndex: number) => {
    const isCurrentWord = wordIndex === currentWordIndex;
    const typedWords = userInput.split(/\s+/g);
    const typedWord = typedWords[wordIndex] || "";

    if (wordIndex < currentWordIndex) {
      // Completed words
      const isCorrect = typedWord === word;
      return (
        <span
          key={wordIndex}
          className={cn(
            "inline-block mr-2 mb-1 px-1 rounded",
            isNepaliMode && "ml-2 mr-0",
            isCorrect
              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
          )}
        >
          {word}
        </span>
      );
    } else if (isCurrentWord) {
      // Current word being typed with character-level feedback
      return (
        <span key={wordIndex} className={cn("inline-block mr-2 mb-1 relative", isNepaliMode && "ml-2 mr-0")}>
          <span className="bg-blue-100 dark:bg-blue-900 px-1 rounded font-semibold">
            {Array.from(word).map((char, charIndex) => {
              const typedChar = Array.from(typedWord)[charIndex];
              let className = "";
              let displayChar = char;

              // Handle typed characters
              if (charIndex < typedWord.length) {
                // Special handling for Nepali half-typed characters
                if (isNepaliMode && charIndex === typedWord.length - 1 && typedWord.length < word.length) {
                  const isHalfTyped = typedChar !== char;
                  className = isHalfTyped
                    ? "text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900"
                    : typedChar === char
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900";
                } else {
                  className = typedChar === char
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900";
                }
              } else if (charIndex === typedWord.length) {
                // Current cursor position
                className = "bg-blue-500 text-white animate-pulse";
              }

              // Optional: Show decomposition in dev mode
              if (isNepaliMode && charIndex === typedWord.length && process.env.NODE_ENV === "production") {
                displayChar = `[${char}]`;
              }

              return (
                <span key={charIndex} className={className}>
                  {displayChar}
                </span>
              );
            })}
            {typedWord.length > word.length && (
              <span className="text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900">
                {typedWord.slice(word.length)}
              </span>
            )}
          </span>
        </span>
      );
    } else {
      // Upcoming words
      return (
        <span
          key={wordIndex}
          className={cn("inline-block mr-2 mb-1 text-muted-foreground", isNepaliMode && "ml-2 mr-0")}
        >
          {word}
        </span>
      );
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          {isNepaliMode ? "नेपाली टाइपिङ परीक्षण" : "Typing Speed Test"}
        </h1>
        <p className="text-muted-foreground">
          {isNepaliMode
            ? "तपाईंको टाइपिङ गति र शुद्धता परीक्षण गर्नुहोस्"
            : "Test your typing speed and accuracy with real-time feedback"}
        </p>
      </div>

      {/* Test Configuration */}
      {!isTestActive && !isTestComplete && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-card rounded-lg border"
        >
          <div className="flex flex-wrap gap-4 items-center">
            {/* Mode Selection */}
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              <span className="text-sm font-medium">{isNepaliMode ? "प्रकार" : "Mode"}:</span>
              <div className="flex gap-1">
                <Button
                  variant={testMode === "words" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTestMode("words")}
                >
                  Words
                </Button>
                <Button
                  variant={testMode === "quotes" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTestMode("quotes")}
                >
                  Quotes
                </Button>
                <Button
                  variant={testMode === "code" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTestMode("code")}
                >
                  Code
                </Button>
                <Button
                  variant={testMode === "nepali-words" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTestMode("nepali-words")}
                >
                  शब्द
                </Button>
                <Button
                  variant={testMode === "nepali-quotes" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTestMode("nepali-quotes")}
                >
                  उद्धरण
                </Button>
                <Button
                  variant={testMode === "custom" ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    setTestMode("custom");
                    setIsEditingCustomText(true);
                  }}
                >
                  Free
                </Button>
              </div>
            </div>

            {/* Time Selection */}
            <div className="flex items-center gap-2">
              <Timer className="w-4 h-4" />
              <span className="text-sm font-medium">{isNepaliMode ? "समय" : "Time"}:</span>
              <div className="flex gap-1">
                {[15, 30, 60, 120].map((time) => (
                  <Button
                    key={time}
                    variant={timeLimit === time ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTimeLimit(time)}
                  >
                    {time}s
                  </Button>
                ))}
              </div>
            </div>

            {/* Word Count Selection */}
            {(testMode === "words" || testMode === "nepali-words") && (
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4" />
                <span className="text-sm font-medium">{isNepaliMode ? "शब्द संख्या" : "Words"}:</span>
                <div className="flex gap-1">
                  {[25, 50, 100, 200].map((count) => (
                    <Button
                      key={count}
                      variant={wordCount === count ? "default" : "outline"}
                      size="sm"
                      onClick={() => setWordCount(count)}
                    >
                      {count}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Custom Text Editor */}
      {testMode === "custom" && !isTestActive && !isTestComplete && isEditingCustomText && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="mb-6 p-6 bg-card rounded-lg border shadow-sm"
          role="region"
          aria-labelledby="custom-text-editor-heading"
        >
          <div className="flex flex-col gap-4">
            {/* Header with actions */}
            <div className="flex items-center justify-between">
              <h3
                id="custom-text-editor-heading"
                className="text-xl font-semibold flex items-center gap-2"
              >
                <Edit className="w-5 h-5 text-blue-500" aria-hidden="true" />
                Edit Custom Text
              </h3>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditingCustomText(false)}
                  className="gap-1"
                  aria-label="Cancel editing"
                >
                  <X className="w-4 h-4" aria-hidden="true" />
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={saveCustomText}
                  className="gap-1"
                  aria-label="Save custom text"
                >
                  <Save className="w-4 h-4" aria-hidden="true" />
                  Save
                </Button>
              </div>
            </div>

            {/* Textarea section */}
            <div className="space-y-3">
              <Label htmlFor="custom-text-input" className="text-base">
                Your custom text
              </Label>
              <Textarea
                id="custom-text-input"
                value={customText}
                onChange={handleCustomTextChange}
                className="w-full p-4 border rounded-lg min-h-[150px] max-h-[50vh] text-base resize-y"
                placeholder="Enter your custom text here (supports multiple paragraphs)..."
                aria-describedby="custom-text-help"
              />
              <p id="custom-text-help" className="text-sm text-muted-foreground">
                Enter any text you want to use for your typing test
              </p>
            </div>

            {/* Footer with actions */}
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                <span aria-live="polite">
                  {customText.trim().length} character{customText.trim().length !== 1 ? 's' : ''}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setCustomText("The quick brown fox jumps over the lazy dog.")}
                  className="gap-1"
                  aria-label="Load example text"
                >
                  <Sparkles className="w-4 h-4" aria-hidden="true" />
                  Example
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setCustomText("")}
                  className="gap-1"
                  aria-label="Clear text"
                >
                  <Trash2 className="w-4 h-4" aria-hidden="true" />
                  Clear
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Live Stats */}
      {(isTestActive || isTestComplete) && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          <div className="bg-card p-4 rounded-lg border text-center">
            <div className="text-2xl font-bold text-blue-600">{Math.round(wpm)}</div>
            <div className="text-sm text-muted-foreground">
              {isNepaliMode ? "प्रति मिनेट शब्द" : "WPM"}
            </div>
          </div>
          <div className="bg-card p-4 rounded-lg border text-center">
            <div className="text-2xl font-bold text-green-600">{Math.round(accuracy)}%</div>
            <div className="text-sm text-muted-foreground">
              {isNepaliMode ? "शुद्धता" : "Accuracy"}
            </div>
          </div>
          <div className="bg-card p-4 rounded-lg border text-center">
            <div className="text-2xl font-bold text-red-600">{errors}</div>
            <div className="text-sm text-muted-foreground">
              {isNepaliMode ? "गल्तीहरू" : "Errors"}
            </div>
          </div>
          <div className="bg-card p-4 rounded-lg border text-center">
            <div className="text-2xl font-bold text-orange-600">{timeRemaining}s</div>
            <div className="text-sm text-muted-foreground">
              {isNepaliMode ? "बाँकी समय" : "Time Left"}
            </div>
          </div>
        </motion.div>
      )}

      {/* Progress Bar */}
      {isTestActive && (
        <div className="mb-6">
          <Progress value={((timeLimit - timeRemaining) / timeLimit) * 100} className="h-2" />
        </div>
      )}

      {/* Typing Area */}
      <div className="mb-6">
        <div
          className={cn(
            "p-6 bg-card rounded-lg border min-h-[200px] text-lg leading-relaxed",
            focusedInput && "ring-2 ring-blue-500",
            isNepaliMode && "text-left font-nepali text-xl"
          )}
          onClick={() => inputRef.current?.focus()}
          role="region"
          aria-label={isNepaliMode ? "नेपाली टाइपिङ क्षेत्र" : "Typing area"}
        >
          <div className={cn("font-mono", isNepaliMode && "font-nepali")}>
            {words.map((word, index) => (
              <React.Fragment key={index}>
                {renderWord(word, index)}
                {index < words.length - 1 && " "}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Hidden Input */}
        <input
          ref={inputRef}
          type="text"
          value={userInput}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setFocusedInput(true)}
          onBlur={() => setFocusedInput(false)}
          className="opacity-0 absolute -z-10"
          disabled={isTestComplete}
          lang={isNepaliMode ? "ne" : "en"}
          aria-label={isNepaliMode ? "टाइपिङ इनपुट" : "Typing input"}
        />
      </div>

      {/* Controls */}
      <div className="flex gap-4 justify-center">
        {!isTestActive && !isTestComplete && testMode !== "custom" && (
          <Button
            onClick={() => {
              startTest();
              inputRef.current?.focus();
            }}
            size="lg"
            className="gap-2"
          >
            <Play className="w-4 h-4" />
            {isNepaliMode ? "सुरु गर्नुहोस्" : "Start Test"}
          </Button>
        )}

        {!isTestActive && !isTestComplete && testMode === "custom" && !isEditingCustomText && (
          <Button
            onClick={() => setIsEditingCustomText(true)}
            size="lg"
            className="gap-2"
          >
            <Play className="w-4 h-4" />
            {"Edit Text"}
          </Button>
        )}

        <Button onClick={resetTest} variant="outline" size="lg" className="gap-2">
          <RotateCcw className="w-4 h-4" />
          {isNepaliMode ? "पुनः सेट गर्नुहोस्" : "Reset"}
        </Button>
      </div>

      {/* Instructions */}
      {!isTestActive && !isTestComplete && (
        <div className="mt-8 text-center text-muted-foreground">
          <p>
            {isNepaliMode
              ? "टेक्स्ट क्षेत्रमा क्लिक गर्नुहोस् वा ट्याब थिच्नुहोस् टाइपिङ सुरु गर्न"
              : "Click on the text area or press Tab to start typing"}
          </p>
          {testMode === "custom" && !isEditingCustomText && (
            <p className="mt-2">
              {"Press 'Edit Text' button to edit your custom text"}
            </p>
          )}
        </div>
      )}
    </div>
  );
}