import React, { useState } from "react";
import { Check, Copy } from "lucide-react";

const CodeBlock = ({ code }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const textToCopy =
      typeof code === "object"
        ? JSON.stringify(code, null, 2)
        : String(code || "");
    await navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Function to highlight a single line of JSON
  const highlightLine = (line) => {
    if (!line) return [];
    const tokens = [];
    let currentIndex = 0;

    // Handle indentation
    const match = line.match(/^(\s*)/);
    if (match) {
      tokens.push({ type: "space", content: match[0] });
      currentIndex = match[0].length;
    }

    // Regular expressions for different JSON elements
    const patterns = [
      { regex: /"([^"]*)"(?=\s*:)/, type: "key" }, // Keys
      { regex: /:\s*/, type: "colon" }, // Colons
      { regex: /"([^"]*)"/, type: "string" }, // Strings
      { regex: /true|false|null/, type: "keyword" }, // Keywords
      { regex: /-?\d+\.?\d*/, type: "number" }, // Numbers
      { regex: /[{}\[\],]/, type: "punctuation" }, // Brackets and commas
      { regex: /\s+/, type: "space" }, // Whitespace
    ];

    while (currentIndex < line.length) {
      let matched = false;

      for (const { regex, type } of patterns) {
        const match = line.slice(currentIndex).match(regex);
        if (match && match.index === 0) {
          tokens.push({ type, content: match[0] });
          currentIndex += match[0].length;
          matched = true;
          break;
        }
      }

      if (!matched) {
        // Handle any unmatched characters
        tokens.push({
          type: "text",
          content: line[currentIndex],
        });
        currentIndex++;
      }
    }

    return tokens.map((token, i) => {
      const className =
        {
          key: "text-purple-600 dark:text-purple-400",
          colon: "text-gray-600 dark:text-gray-400",
          string: "text-green-600 dark:text-green-400",
          number: "text-blue-600 dark:text-blue-400",
          keyword: "text-red-600 dark:text-red-400",
          punctuation: "text-gray-600 dark:text-gray-400",
          text: "text-gray-800 dark:text-gray-200",
          space: "",
        }[token.type] || "";

      return (
        <span key={i} className={className}>
          {token.content}
        </span>
      );
    });
  };

  const highlightJson = (inputCode) => {
    if (inputCode == null) {
      return <div className="text-gray-500 dark:text-gray-400">null</div>;
    }

    let jsonString = "";
    try {
      if (typeof inputCode === "object") {
        jsonString = JSON.stringify(inputCode, null, 2);
      } else {
        // Handle primitive values
        jsonString = String(inputCode);
      }
    } catch (error) {
      return <div className="text-red-500">Invalid JSON</div>;
    }

    return jsonString.split("\n").map((line, i) => (
      <div key={i} className="leading-6">
        {highlightLine(line)}
      </div>
    ));
  };

  return (
    <div className="relative group">
      <button
        onClick={handleCopy}
        className="absolute right-4 top-4 p-2 rounded-md opacity-0 group-hover:opacity-100 transition-opacity bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
        aria-label="Copy code"
      >
        {copied ? (
          <Check className="w-4 h-4 text-green-500" />
        ) : (
          <Copy className="w-4 h-4 text-gray-500 dark:text-gray-400" />
        )}
      </button>
      <pre className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6 overflow-x-auto font-mono text-sm">
        <code className="block">{highlightJson(code)}</code>
      </pre>
    </div>
  );
};

export default CodeBlock;
