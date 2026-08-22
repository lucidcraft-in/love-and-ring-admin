import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Bold,
  Italic,
  Underline,
  Heading1,
  Heading2,
  Heading3,
  Pilcrow,
  List,
  ListOrdered,
  Link as LinkIcon,
  Quote,
} from "lucide-react";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Enter text or HTML content...",
  minHeight = "320px",
}: RichTextEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertTag = (openTag: string, closeTag: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentVal = value || "";
    const selectedText = currentVal.substring(start, end);

    // If text is selected, wrap selected text. If not selected, insert empty open and close tags only.
    const replacement = `${openTag}${selectedText}${closeTag}`;
    const newContent =
      currentVal.substring(0, start) + replacement + currentVal.substring(end);

    onChange(newContent);

    setTimeout(() => {
      textarea.focus();
      if (selectedText) {
        // Keep selected text highlighted inside tags
        textarea.setSelectionRange(
          start + openTag.length,
          start + openTag.length + selectedText.length
        );
      } else {
        // Put cursor right between openTag and closeTag: e.g. <b>|</b>
        const cursorPos = start + openTag.length;
        textarea.setSelectionRange(cursorPos, cursorPos);
      }
    }, 20);
  };

  const handleLink = () => {
    const url = prompt("Enter URL:", "https://");
    if (url) {
      insertTag(`<a href="${url}" target="_blank">`, "</a>");
    }
  };

  const handleCallout = () => {
    insertTag(
      `<blockquote style="border-left: 4px solid var(--primary, #e11d48); padding: 12px 16px; margin: 12px 0; background-color: rgba(225, 29, 72, 0.05); font-style: italic; border-radius: 0 8px 8px 0;">\n  `,
      `\n</blockquote>`
    );
  };

  return (
    <div className="border rounded-xl bg-background overflow-hidden flex flex-col shadow-sm focus-within:ring-1 focus-within:ring-primary border-border">
      {/* HTML Formatting Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 bg-muted/40 border-b border-border text-xs select-none">
        <span className="text-muted-foreground mr-1 font-semibold text-[11px] uppercase tracking-wider">
          Format:
        </span>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 px-2 font-bold hover:bg-muted"
          onClick={() => insertTag("<b>", "</b>")}
          title="Bold"
        >
          <Bold className="w-3.5 h-3.5 mr-1" /> Bold
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 px-2 italic hover:bg-muted"
          onClick={() => insertTag("<i>", "</i>")}
          title="Italic"
        >
          <Italic className="w-3.5 h-3.5 mr-1" /> Italic
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 px-2 underline hover:bg-muted"
          onClick={() => insertTag("<u>", "</u>")}
          title="Underline"
        >
          <Underline className="w-3.5 h-3.5 mr-1" /> Underline
        </Button>

        <div className="h-4 w-px bg-border mx-1" />

        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 px-2 hover:bg-muted font-medium"
          onClick={() => insertTag("<h1>", "</h1>")}
          title="Heading 1"
        >
          <Heading1 className="w-3.5 h-3.5 mr-1" /> Heading 1
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 px-2 hover:bg-muted font-medium"
          onClick={() => insertTag("<h2>", "</h2>")}
          title="Heading 2"
        >
          <Heading2 className="w-3.5 h-3.5 mr-1" /> Heading 2
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 px-2 hover:bg-muted font-medium"
          onClick={() => insertTag("<h3>", "</h3>")}
          title="Heading 3"
        >
          <Heading3 className="w-3.5 h-3.5 mr-1" /> Heading 3
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 px-2 hover:bg-muted font-medium"
          onClick={() => insertTag("<p>", "</p>")}
          title="Paragraph"
        >
          <Pilcrow className="w-3.5 h-3.5 mr-1" /> Paragraph
        </Button>

        <div className="h-4 w-px bg-border mx-1" />

        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 px-2 hover:bg-muted"
          onClick={() => insertTag("<ul>\n  <li>", "</li>\n</ul>")}
          title="Bullet List"
        >
          <List className="w-3.5 h-3.5 mr-1" /> Bullets
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 px-2 hover:bg-muted"
          onClick={() => insertTag("<ol>\n  <li>", "</li>\n</ol>")}
          title="Numbered List"
        >
          <ListOrdered className="w-3.5 h-3.5 mr-1" /> Numbered
        </Button>

        <div className="h-4 w-px bg-border mx-1" />

        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 px-2 hover:bg-muted"
          onClick={handleLink}
          title="Insert Link"
        >
          <LinkIcon className="w-3.5 h-3.5 mr-1" /> Link
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 px-2 hover:bg-muted"
          onClick={handleCallout}
          title="Callout Box"
        >
          <Quote className="w-3.5 h-3.5 mr-1" /> Callout
        </Button>
      </div>

      {/* Editor HTML Textarea */}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full p-4 font-mono text-xs leading-relaxed bg-background outline-none resize-y"
        style={{ minHeight }}
      />
    </div>
  );
}
