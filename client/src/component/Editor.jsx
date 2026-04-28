import React from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { dracula } from '@uiw/codemirror-theme-dracula';
import { javascript } from '@codemirror/lang-javascript';
import { cpp } from '@codemirror/lang-cpp';
import { java } from '@codemirror/lang-java';

const getLanguageExtension = (language) => {
  switch (language) {
    case 'javascript':
      return [javascript({ jsx: true })];
    case 'cpp':
      return [cpp()];
    case 'java':
      return [java()];
    default:
      return [javascript({ jsx: true })];
  }
};

function Editor({ language = 'javascript', value, onChange }) {
  const handleChange = React.useCallback((val) => {
    if (onChange) {
      onChange(val);
    }
  }, [onChange]);

  return (
    <CodeMirror
      value={value}
      height="100%"
      theme={dracula}
      extensions={getLanguageExtension(language)}
      onChange={handleChange}
      style={{
        height: '100%',
        fontSize: 16,
      }}
    />
    
  )
}

export default Editor