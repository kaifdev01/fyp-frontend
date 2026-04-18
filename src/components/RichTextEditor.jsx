'use client';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Bold, Italic, List, ListOrdered, Heading2, Heading3, Minus } from 'lucide-react';

const ToolbarBtn = ({ onClick, active, children, title }) => (
  <button
    type="button"
    title={title}
    onMouseDown={(e) => { e.preventDefault(); onClick(); }}
    className={`p-2 rounded-lg transition-colors ${active ? 'bg-green-100 text-green-700' : 'text-gray-600 hover:bg-gray-100'}`}
  >
    {children}
  </button>
);

export default function RichTextEditor({ value, onChange }) {
  const editor = useEditor({ immediatelyRender: false,
    extensions: [StarterKit],
    content: value || '',
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class: 'min-h-[180px] px-4 py-3 focus:outline-none prose prose-sm max-w-none',
      },
    },
  });

  if (!editor) return null;

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-green-500/20 focus-within:border-green-400 transition-all">
      <div className="flex flex-wrap gap-1 p-2 border-b border-gray-200 bg-gray-50">
        <ToolbarBtn title="Bold" onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')}>
          <Bold size={16} />
        </ToolbarBtn>
        <ToolbarBtn title="Italic" onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')}>
          <Italic size={16} />
        </ToolbarBtn>
        <div className="w-px bg-gray-200 mx-1" />
        <ToolbarBtn title="Heading 2" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })}>
          <Heading2 size={16} />
        </ToolbarBtn>
        <ToolbarBtn title="Heading 3" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive('heading', { level: 3 })}>
          <Heading3 size={16} />
        </ToolbarBtn>
        <div className="w-px bg-gray-200 mx-1" />
        <ToolbarBtn title="Bullet List" onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')}>
          <List size={16} />
        </ToolbarBtn>
        <ToolbarBtn title="Numbered List" onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')}>
          <ListOrdered size={16} />
        </ToolbarBtn>
        <div className="w-px bg-gray-200 mx-1" />
        <ToolbarBtn title="Divider" onClick={() => editor.chain().focus().setHorizontalRule().run()} active={false}>
          <Minus size={16} />
        </ToolbarBtn>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
