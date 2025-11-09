// src/hooks/useSearch.js
"use client";

import { useRef, useCallback } from "react";

export const useSearch = () => {
  const currentIndexRef = useRef(0);
  const searchResultsRef = useRef([]);
  const lastSearchTermRef = useRef("");

  const highlightInNode = useCallback((node, searchTerm, elements) => {
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
  }, []);

  const highlightText = useCallback(
    (searchTerm, moveToNext = false) => {
      const searchLower = searchTerm.toLowerCase().trim();

      // If same search term and moveToNext is true, cycle to next result
      if (
        moveToNext &&
        searchTerm === lastSearchTermRef.current &&
        searchResultsRef.current.length > 0
      ) {
        const nextIndex =
          (currentIndexRef.current + 1) % searchResultsRef.current.length;
        currentIndexRef.current = nextIndex;

        // Remove active class from all
        searchResultsRef.current.forEach((el) =>
          el.classList.remove("search-highlight-active")
        );

        // Add active class to current
        searchResultsRef.current[nextIndex].classList.add(
          "search-highlight-active"
        );

        // Scroll to current
        searchResultsRef.current[nextIndex].scrollIntoView({
          behavior: "smooth",
          block: "center",
        });

        return {
          count: searchResultsRef.current.length,
          elements: searchResultsRef.current,
          currentIndex: nextIndex + 1,
        };
      }

      // Remove previous highlights
      const existingHighlights = document.querySelectorAll(".search-highlight");
      existingHighlights.forEach((el) => {
        const parent = el.parentNode;
        parent.replaceChild(document.createTextNode(el.textContent), el);
        parent.normalize();
      });

      if (!searchTerm || searchTerm.trim() === "") {
        searchResultsRef.current = [];
        currentIndexRef.current = 0;
        lastSearchTermRef.current = "";
        return { count: 0, elements: [], currentIndex: 0 };
      }

      const elements = [];

      // Sections to search in
      const searchableSelectors = [
        ".section-header h2",
        ".section-header p",
        ".alert-header",
        ".alert-card h3",
        ".alert-card p",
        ".alert-location",
        ".hotline-card h3",
        ".hotline-card p",
        ".table-container td",
        ".table-container th",
        ".stat-card-title",
        ".stat-change",
        ".chart-bar-label",
        ".log-action",
        ".log-user",
        ".log-details",
        ".log-timestamp",
        ".log-message",
      ];

      searchableSelectors.forEach((selector) => {
        const nodeList = document.querySelectorAll(selector);
        nodeList.forEach((node) => {
          highlightInNode(node, searchLower, elements);
        });
      });

      // Store results
      searchResultsRef.current = elements;
      currentIndexRef.current = 0;
      lastSearchTermRef.current = searchTerm;

      // Scroll to first match
      if (elements.length > 0) {
        elements[0].scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
        elements[0].classList.add("search-highlight-active");
      }

      return {
        count: elements.length,
        elements,
        currentIndex: elements.length > 0 ? 1 : 0,
      };
    },
    [highlightInNode]
  );

  const clearHighlights = useCallback(() => {
    const existingHighlights = document.querySelectorAll(".search-highlight");
    existingHighlights.forEach((el) => {
      const parent = el.parentNode;
      parent.replaceChild(document.createTextNode(el.textContent), el);
      parent.normalize();
    });
    searchResultsRef.current = [];
    currentIndexRef.current = 0;
    lastSearchTermRef.current = "";
  }, []);

  return { highlightText, clearHighlights };
};
