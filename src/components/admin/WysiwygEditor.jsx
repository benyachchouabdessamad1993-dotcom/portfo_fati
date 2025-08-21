import React, { useState, useEffect } from 'react';
import MDEditor from '@uiw/react-md-editor/nohighlight';

const WysiwygEditor = ({ value, onChange, placeholder }) => {
  return (
    <MDEditor
      value={value}
      onChange={onChange}
      data-color-mode="light"
      preview="edit"
      hideToolbar={false}
      textareaProps={{
        placeholder: placeholder || 'Entrez votre contenu ici...',
        style: {
          fontSize: 14,
          backgroundColor: '#f8f9fa',
          fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
        },
      }}
    />
  );
};

export default WysiwygEditor;