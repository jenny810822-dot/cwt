"use client"
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import ImageExt from "@tiptap/extension-image"
import LinkExt from "@tiptap/extension-link"
import Placeholder from "@tiptap/extension-placeholder"
import Underline from "@tiptap/extension-underline"
import TextAlign from "@tiptap/extension-text-align"
import { useCallback, useEffect, useRef, useState } from "react"
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough,
  Heading1, Heading2, Heading3,
  List, ListOrdered, Quote, Code2, Minus,
  Link as LinkIcon, Image as ImageIcon,
  AlignLeft, AlignCenter, AlignRight,
  Eraser, Undo2, Redo2, ImagePlus,
} from "lucide-react"

interface RichEditorProps {
  value: string
  onChange: (html: string) => void
}

const BTN = "p-1.5 rounded-lg transition-all hover:bg-pink-50 disabled:opacity-30 disabled:cursor-not-allowed"
const ACTIVE_BTN = "p-1.5 rounded-lg transition-all bg-pink-100"

export default function RichEditor({ value, onChange }: RichEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [linkUrl, setLinkUrl] = useState("")
  const [showLink, setShowLink] = useState(false)

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      ImageExt.configure({ allowBase64: false }),
      LinkExt.configure({
        openOnClick: false,
        HTMLAttributes: { class: "text-pink-500 underline", target: "_blank", rel: "noopener noreferrer" },
      }),
      Placeholder.configure({ placeholder: "在這裡撰寫文章內容……" }),
    ],
    content: value || "",
    onUpdate({ editor }) {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: "rich-content outline-none min-h-[280px] px-5 py-4",
      },
    },
  })

  // sync external value changes (e.g. load from server)
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || "", { emitUpdate: false })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  const handleImageUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !editor) return
    setUploading(true)
    const fd = new FormData()
    fd.append("file", file)
    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd })
      const { url } = await res.json()
      if (url) editor.chain().focus().setImage({ src: url }).run()
    } finally {
      setUploading(false)
      e.target.value = ""
    }
  }, [editor])

  const handleSetLink = useCallback(() => {
    if (!editor) return
    if (linkUrl.trim() === "") {
      editor.chain().focus().unsetLink().run()
    } else {
      editor.chain().focus().setLink({ href: linkUrl.trim() }).run()
    }
    setLinkUrl("")
    setShowLink(false)
  }, [editor, linkUrl])

  if (!editor) return null

  const btn = (active: boolean) => active ? ACTIVE_BTN : BTN
  const ic = { size: 14, style: { color: "#5a4550" } }

  return (
    <div className="rounded-xl overflow-hidden" style={{ border: "1.5px solid #f0e4ea", background: "white" }}>

      {/* Toolbar */}
      <div
        className="flex flex-wrap items-center gap-0.5 px-3 py-2"
        style={{ borderBottom: "1px solid #f0e4ea", background: "#fdf8fa" }}
      >
        {/* Undo / Redo */}
        <button type="button" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} className={BTN} title="復原">
          <Undo2 {...ic} />
        </button>
        <button type="button" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} className={BTN} title="重做">
          <Redo2 {...ic} />
        </button>

        <Divider />

        {/* Headings */}
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={btn(editor.isActive("heading", { level: 1 }))} title="H1">
          <Heading1 {...ic} />
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={btn(editor.isActive("heading", { level: 2 }))} title="H2">
          <Heading2 {...ic} />
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={btn(editor.isActive("heading", { level: 3 }))} title="H3">
          <Heading3 {...ic} />
        </button>

        <Divider />

        {/* Text style */}
        <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={btn(editor.isActive("bold"))} title="粗體">
          <Bold {...ic} />
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={btn(editor.isActive("italic"))} title="斜體">
          <Italic {...ic} />
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleUnderline().run()} className={btn(editor.isActive("underline"))} title="底線">
          <UnderlineIcon {...ic} />
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleStrike().run()} className={btn(editor.isActive("strike"))} title="刪除線">
          <Strikethrough {...ic} />
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleCode().run()} className={btn(editor.isActive("code"))} title="行內程式碼">
          <Code2 {...ic} />
        </button>

        <Divider />

        {/* Alignment */}
        <button type="button" onClick={() => editor.chain().focus().setTextAlign("left").run()} className={btn(editor.isActive({ textAlign: "left" }))} title="靠左">
          <AlignLeft {...ic} />
        </button>
        <button type="button" onClick={() => editor.chain().focus().setTextAlign("center").run()} className={btn(editor.isActive({ textAlign: "center" }))} title="置中">
          <AlignCenter {...ic} />
        </button>
        <button type="button" onClick={() => editor.chain().focus().setTextAlign("right").run()} className={btn(editor.isActive({ textAlign: "right" }))} title="靠右">
          <AlignRight {...ic} />
        </button>

        <Divider />

        {/* Lists */}
        <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={btn(editor.isActive("bulletList"))} title="無序清單">
          <List {...ic} />
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={btn(editor.isActive("orderedList"))} title="有序清單">
          <ListOrdered {...ic} />
        </button>

        <Divider />

        {/* Blocks */}
        <button type="button" onClick={() => editor.chain().focus().toggleBlockquote().run()} className={btn(editor.isActive("blockquote"))} title="引用">
          <Quote {...ic} />
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleCodeBlock().run()} className={btn(editor.isActive("codeBlock"))} title="程式碼區塊">
          <Code2 size={14} style={{ color: editor.isActive("codeBlock") ? "#e8789a" : "#5a4550" }} />
        </button>
        <button type="button" onClick={() => editor.chain().focus().setHorizontalRule().run()} className={BTN} title="分隔線">
          <Minus {...ic} />
        </button>

        <Divider />

        {/* Link */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setLinkUrl(editor.isActive("link") ? (editor.getAttributes("link").href ?? "") : "")
              setShowLink(v => !v)
            }}
            className={btn(editor.isActive("link"))}
            title="插入連結"
          >
            <LinkIcon {...ic} />
          </button>
          {showLink && (
            <div
              className="absolute top-8 left-0 z-20 rounded-xl p-3 flex items-center gap-2 shadow-lg"
              style={{ background: "white", border: "1px solid #f0e4ea", width: 280 }}
            >
              <input
                autoFocus
                value={linkUrl}
                onChange={e => setLinkUrl(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); handleSetLink() } if (e.key === "Escape") setShowLink(false) }}
                placeholder="https://..."
                className="flex-1 text-xs px-2 py-1.5 rounded-lg outline-none"
                style={{ background: "#fdf8fa", border: "1px solid #f0e4ea", color: "#1a0f14" }}
              />
              <button type="button" onClick={handleSetLink} className="text-xs font-semibold px-2.5 py-1.5 rounded-lg text-white" style={{ background: "#e8789a" }}>
                {editor.isActive("link") ? "移除" : "套用"}
              </button>
            </div>
          )}
        </div>

        {/* Image upload */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className={BTN}
          title={uploading ? "上傳中…" : "插入圖片"}
        >
          {uploading ? <ImagePlus size={14} style={{ color: "#e8789a" }} /> : <ImageIcon {...ic} />}
        </button>
        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />

        <Divider />

        {/* Clear formatting */}
        <button type="button" onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()} className={BTN} title="清除格式">
          <Eraser {...ic} />
        </button>
      </div>

      {/* Editor content */}
      <EditorContent editor={editor} />
    </div>
  )
}

function Divider() {
  return <div className="w-px h-4 mx-1 flex-shrink-0" style={{ background: "#f0e4ea" }} />
}
