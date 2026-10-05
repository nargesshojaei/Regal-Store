"use client";
{/*ویرایشگر توضیحات.

نوار ابزار: ضخیم، کج، زیرخط، فهرست، لینک، چینش راست
خروجی HTML است (<b>, <ul>, <a> و ...)
همان HTML روی سرور در فیلد description ذخیره می‌شود */
}
import { useEffect, useRef } from "react";
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Link2,
  AlignRight,
} from "lucide-react";

export default function HtmlEditor({
  html,
  onChange,
  disabled,
}: {
  html: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}) {
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (box.current) box.current.innerHTML = html || "";
  }, [html]);

  function update() {
    onChange(box.current?.innerHTML ?? "");
  }

  function format(command: string) {
    box.current?.focus();
    document.execCommand(command);
    update();
  }

  return (
    <div className="overflow-hidden rounded-lg border border-neutral-03 bg-white">
      <div className="flex flex-wrap items-center gap-1 border-b border-neutral-03 bg-neutral-01 px-2 py-1.5">
        <button type="button" title="ضخیم" disabled={disabled} onMouseDown={(e) => e.preventDefault()} onClick={() => format("bold")} className="rounded-md p-1.5 text-neutral-11 hover:bg-neutral-03 disabled:opacity-50">
          <Bold className="size-4" strokeWidth={1.75} />
        </button>
        <button type="button" title="کج" disabled={disabled} onMouseDown={(e) => e.preventDefault()} onClick={() => format("italic")} className="rounded-md p-1.5 text-neutral-11 hover:bg-neutral-03 disabled:opacity-50">
          <Italic className="size-4" strokeWidth={1.75} />
        </button>
        <button type="button" title="زیرخط" disabled={disabled} onMouseDown={(e) => e.preventDefault()} onClick={() => format("underline")} className="rounded-md p-1.5 text-neutral-11 hover:bg-neutral-03 disabled:opacity-50">
          <Underline className="size-4" strokeWidth={1.75} />
        </button>
        <button type="button" title="فهرست" disabled={disabled} onMouseDown={(e) => e.preventDefault()} onClick={() => format("insertUnorderedList")} className="rounded-md p-1.5 text-neutral-11 hover:bg-neutral-03 disabled:opacity-50">
          <List className="size-4" strokeWidth={1.75} />
        </button>
        <button type="button" title="فهرست شماره‌دار" disabled={disabled} onMouseDown={(e) => e.preventDefault()} onClick={() => format("insertOrderedList")} className="rounded-md p-1.5 text-neutral-11 hover:bg-neutral-03 disabled:opacity-50">
          <ListOrdered className="size-4" strokeWidth={1.75} />
        </button>
        <button type="button" title="چینش راست" disabled={disabled} onMouseDown={(e) => e.preventDefault()} onClick={() => format("justifyRight")} className="rounded-md p-1.5 text-neutral-11 hover:bg-neutral-03 disabled:opacity-50">
          <AlignRight className="size-4" strokeWidth={1.75} />
        </button>
        <button
          type="button"
          title="لینک"
          disabled={disabled}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => {
            const url = window.prompt("آدرس لینک را وارد کنید", "https://");
            if (!url) return;
            box.current?.focus();
            document.execCommand("createLink", false, url);
            update();
          }}
          className="rounded-md p-1.5 text-neutral-11 hover:bg-neutral-03 disabled:opacity-50"
        >
          <Link2 className="size-4" strokeWidth={1.75} />
        </button>
      </div>
      <div
        ref={box}
        contentEditable={!disabled}
        suppressContentEditableWarning
        dir="rtl"
        onInput={update}
        className="min-h-32 px-3 py-2 text-sm leading-7 text-black outline-none [&_a]:text-primary [&_a]:underline [&_ol]:list-decimal [&_ol]:pr-5 [&_ul]:list-disc [&_ul]:pr-5"
      />
    </div>
  );
}
