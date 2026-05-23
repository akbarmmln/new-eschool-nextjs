'use client'

import {
  EditorContent,
  useEditor,
} from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import FontFamily from '@tiptap/extension-font-family'
import { TextStyle } from '@tiptap/extension-text-style'
import {
  useEffect,
  useState,
} from "react";

type Props = {
  name?: string,
  value: string
  onChange: (
    value: string
  ) => void
}

export default function JournalEditor({
  name,
  value,
  onChange,
}: Props) {

  const [
    editorRefresh,
    setEditorRefresh,
  ] = useState(0)

  const editor = useEditor({
    immediatelyRender: false,
    autofocus: false,
    extensions: [
      StarterKit.configure({
        underline: false,
        link: false,
      }),
      TextStyle,
      Underline,
      FontFamily,
      Link,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Placeholder.configure({
        placeholder:
          'Tuliskan materi yang diajarkan...',
      }),
    ],
    content: value,
    onCreate({ editor }) {
      editor
        .chain()
        .focus()
        .setFontFamily('monospace')
        .setTextAlign('left')
        .run()
    },
    onUpdate({ editor }) {
      onChange(
        editor.getHTML()
      )
    },
    editorProps: {
      handleScrollToSelection: () => {
        return true
      },
      attributes: {
        class: 'ProseMirror',
        tabindex: '-1',
      },
    },
  })

  useEffect(() => {

    if (!editor) {
      return
    }

    const updateToolbar = () => {

      setEditorRefresh(
        prev => prev + 1
      )
    }

    editor.on(
      'selectionUpdate',
      updateToolbar
    )

    editor.on(
      'transaction',
      updateToolbar
    )

    return () => {

      editor.off(
        'selectionUpdate',
        updateToolbar
      )

      editor.off(
        'transaction',
        updateToolbar
      )
    }

  }, [editor])

  if (!editor) {
    return null
  }

  return (
    <>
      <div className="editor-box">
        <div className="editor-toolbar">
          <select
            className="editor-select"
            onChange={(e) => {
              editor
                ?.chain()
                .focus()
                .setFontFamily(
                  e.target.value
                )
                .run()
            }}
            defaultValue="Monospace">

            <option value="sans-serif">
              Sans Serif
            </option>

            <option value="serif">
              Serif
            </option>

            <option value="Arial">
              Arial
            </option>

            <option value="Times New Roman">
              Times New Roman
            </option>

            <option value="Monospace">
              Monospace
            </option>
          </select>

          <div className="divider" />
          
          <select
            className="editor-select"
            onChange={(e) => {
              const value = e.target.value
              if (value === 'p') {
                editor
                  .chain()
                  .focus()
                  .setParagraph()
                  .run()
                return
              }
              editor
                .chain()
                .focus()
                .toggleHeading({
                  level:
                    Number(value) as 1 | 2 | 3,
                })
                .run()
            }} >

            <option value="p">
              Normal
            </option>

            <option value="3">
              Large
            </option>

            <option value="1">
              Huge
            </option>
          </select>

          <button
            type="button"
            onClick={() =>
              editor
                .chain()
                .focus()
                .toggleBold()
                .run()
            }
            className={ editor.isActive('bold') ? 'active' : ''
            } >
            <i className="ri-bold" />
          </button>

          <button
            type="button"
            onClick={() =>
              editor
                .chain()
                .focus()
                .toggleItalic()
                .run()
            }
            className={ editor.isActive('italic') ? 'active' : ''
            } >
            <i className="ri-italic" />
          </button>

          <button
            type="button"
            onClick={() =>
              editor
                .chain()
                .focus()
                .toggleUnderline()
                .run()
            }
            className={editor.isActive('underline') ? 'active' : ''
            } >
            <i className="ri-underline" />
          </button>

          <button
            type="button"
            onClick={() =>
              editor
                .chain()
                .focus()
                .toggleStrike()
                .run()
            }
            className={ editor.isActive('strike') ? 'active' : ''
            } >
            <i className="ri-strikethrough" />
          </button>

          <div className="divider" />

          <button
            type="button"
            onClick={() =>
              editor
                .chain()
                .focus()
                .toggleBulletList()
                .run()
            } 
            className={
              editor.isActive('bulletList')
                ? 'active'
                : ''
            } >
            <i className="ri-list-unordered" />
          </button>

          <button
            type="button"
            onClick={() =>
              editor
                .chain()
                .focus()
                .toggleOrderedList()
                .run()
            }
            className={
              editor.isActive('orderedList')
                ? 'active'
                : ''
            } >
            <i className="ri-list-ordered" />
          </button>

          <div className="divider" />

          <button
            type="button"

            className={
              editor.isActive({
                textAlign: 'left'
              })
                ? 'active'
                : ''
            }

            onClick={() =>
              editor
                .chain()
                .focus()
                .setTextAlign('left')
                .run()
            }
          >
            <i className="ri-align-left" />
          </button>

          <button
            type="button"
            onClick={() =>
              editor
                .chain()
                .focus()
                .setTextAlign('center')
                .run()
            }
            className={
              editor.isActive({
                textAlign: 'center'
              })
                ? 'active'
                : ''
            } >
            <i className="ri-align-center" />
          </button>

          <button
            type="button"
            onClick={() =>
              editor
                .chain()
                .focus()
                .setTextAlign('right')
                .run()
            }
            className={
              editor.isActive({
                textAlign: 'right'
              })
                ? 'active'
                : ''
            } >
              <i className="ri-align-right" />
          </button>

          <button
            type="button"
            onClick={() =>
              editor
                .chain()
                .focus()
                .setTextAlign('justify')
                .run()
            }
            className={
              editor.isActive({
                textAlign: 'justify'
              })
                ? 'active'
                : ''
            } >
              <i className="ri-align-justify" />
          </button>
        </div>
        {/* CONTENT */}
        <EditorContent
          editor={editor}
          name={name}
        />

        <input
          type="hidden"
          name={name}
          value={value}
        />
      </div>

      <style jsx>{`
        .editor-toolbar button.active {
          background: #eef2ff;
          color: #5b7fff;
        }
          
        .editor-select {
          height: 42px;
          border: none;
          background: transparent;
          padding: 0 10px;
          border-radius: 10px;
          font-size: 16px;
          color: #1e293b;
          cursor: pointer;
          outline: none;
        }

        .editor-select:hover {
          background: #eef2ff;
        }

        .divider {
          width: 1px;
          height: 26px;
          background: #dbe1ea;
          margin: 0 4px;
        }

        .editor-box {
          width: 100%;
          border: 0px solid #dbe1ea;
          border-radius: 24px;
          overflow: hidden;
          background: #fff;
          display: flex;
          flex-direction: column;
        }

        .editor-toolbar {
          min-height: 72px;
          padding: 14px 18px;
          border-bottom: 1px solid #e5e7eb;
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        :global(.ProseMirror) {
          width: 100%;
          min-height: 260px;
          padding: 24px;
          outline: none;
          font-size: 18px;
          line-height: 1.8;
          color: #1e293b;
        }
          
        :global(.ProseMirror ul) {

          list-style-type: disc;

          padding-left: 28px;

          margin: 1rem 0;
        }

        :global(.ProseMirror ol) {

          list-style-type: decimal;

          padding-left: 28px;

          margin: 1rem 0;
        }

        :global(.ProseMirror li) {

          margin: .35rem 0;
        }
      `}</style>
    </>
  )
}