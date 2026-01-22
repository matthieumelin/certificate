import React from "react";

export const normalize = (value?: string) => value?.trim().toLowerCase();

export const renderStyledText = (
  text: string,
  customStyles?: Record<string, string>,
): React.ReactNode[] => {
  const defaultStyles: Record<string, string> = {
    "**": "text-emerald-400 italic",
    "@@": "text-red-400 italic",
  };

  const styles = customStyles || defaultStyles;

  const delimiters = Object.keys(styles)
    .map((d) => d.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .join("|");
  const regex = new RegExp(`(${delimiters})(.*?)\\1`, "g");

  const result: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      result.push(text.slice(lastIndex, match.index));
    }

    result.push(
      React.createElement(
        "span",
        {
          key: `styled-${result.length}`,
          className: styles[match[1]],
        },
        match[2],
      ),
    );

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    result.push(text.slice(lastIndex));
  }

  return result;
};
