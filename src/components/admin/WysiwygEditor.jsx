import React, { useState, useEffect } from 'react';
import MDEditor from '@uiw/react-markdown-editor';

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


## Solutions possibles :

### Solution 1 : Remplacer par une alternative plus stable

Modifiez <mcfile name="WysiwygEditor.jsx" path="/Users/abdessamad/Downloads/lakrami_portf_V1/src/components/admin/WysiwygEditor.jsx"></mcfile> pour utiliser un simple textarea :
```javascript
import React from 'react';

const WysiwygEditor = ({ value, onChange, placeholder }) => {
  return (
    <textarea
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder || 'Entrez votre contenu ici...'}
      className="w-full min-h-[200px] p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      style={{
        fontSize: 14,
        backgroundColor: '#f8f9fa',
        fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
        resize: 'vertical'
      }}
    />
  );
};

export default WysiwygEditor;
```
