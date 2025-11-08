// src/hooks/useSearch.js
"use client";

import { useEffect, useCallback } from "react";

export const useSearch = () => {
  const highlightText = useCallback((searchTerm) => {
    // Remove previous highlights
    const existingHighlights = document.querySelectorAll(".search-highlight");
    existingHighlights.forEach((el) => {
      const parent = el.parentNode;
      parent.replaceChild(document.createTextNode(el.textContent), el);
      parent.normalize();
    });

    if (!searchTerm || searchTerm.trim() === "")
      return { count: 0, elements: [] };

    const searchLower = searchTerm.toLowerCase().trim();
    const elements = [];
    let matchCount = 0;

    // Sections to search in
    const searchableSelectors = [
      ".section-header h2",
      ".section-header p",
      ".alert-card h3",
      ".alert-card p",
      ".hotline-card h3",
      ".hotline-card p",
      ".table-container td",
      ".table-container th",
      ".stat-card-title",
      ".log-action",
      ".log-user",
    ];

    searchableSelectors.forEach((selector) => {
      const nodeList = document.querySelectorAll(selector);
      nodeList.forEach((node) => {
        highlightInNode(node, searchLower, elements);
      });
    });

    matchCount = elements.length;

    // Scroll to first match
    if (elements.length > 0) {
      elements[0].scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      elements[0].classList.add("search-highlight-active");
    }

    return { count: matchCount, elements };
  }, []);

  const highlightInNode = (node, searchTerm, elements) => {
    const text = node.textContent;
    const textLower = text.toLowerCase();

    if (!textLower.includes(searchTerm)) return;

    // Create a document fragment to build the new content
    const fragment = document.createDocumentFragment();
    let lastIndex = 0;
    let index = textLower.indexOf(searchTerm);

    while (index !== -1) {
      // Add text before match
      if (index > lastIndex) {
        fragment.appendChild(
          document.createTextNode(text.substring(lastIndex, index))
        );
      }

      // Add highlighted match
      const mark = document.createElement("mark");
      mark.className = "search-highlight";
      mark.textContent = text.substring(index, index + searchTerm.length);
      fragment.appendChild(mark);
      elements.push(mark);

      lastIndex = index + searchTerm.length;
      index = textLower.indexOf(searchTerm, lastIndex);
    }

    // Add remaining text
    if (lastIndex < text.length) {
      fragment.appendChild(document.createTextNode(text.substring(lastIndex)));
    }

    // Replace node content
    node.textContent = "";
    node.appendChild(fragment);
  };

  const clearHighlights = useCallback(() => {
    const existingHighlights = document.querySelectorAll(".search-highlight");
    existingHighlights.forEach((el) => {
      const parent = el.parentNode;
      parent.replaceChild(document.createTextNode(el.textContent), el);
      parent.normalize();
    });
  }, []);

  return { highlightText, clearHighlights };
};
