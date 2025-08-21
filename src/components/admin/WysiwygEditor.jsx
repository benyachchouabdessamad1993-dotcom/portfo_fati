import React from 'react'
import MDEditor from '@uiw/react-md-editor'
import '@uiw/react-md-editor/markdown-editor.css'

const WysiwygEditor = ({ value, onChange, placeholder = "Commencez à écrire..." }) => {
  return (
    <div className="wysiwyg-editor">
      <MDEditor
        value={value || ''}
        onChange={(val) => onChange(val || '')}
        preview="edit"
        hideToolbar={false}
        visibleDragbar={false}
        textareaProps={{
          placeholder,
          style: {
            fontSize: 14,
            lineHeight: 1.5,
            fontFamily: 'inherit'
          }
        }}
        height={200}
      />
    </div>
  )
}

export default WysiwygEditor