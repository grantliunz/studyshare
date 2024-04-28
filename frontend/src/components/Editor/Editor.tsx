import { useState } from 'react';

import QuillEditor from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import styles from './Editor.module.css';
import { Button } from '@mui/material';

type editorProps = {
  handleSubmit: (value: string) => void;
};

export default function Editor({ handleSubmit }: editorProps) {
  const [value, setValue] = useState('');

  function onSubmit() {
    handleSubmit(value);
  }

  const modules = {
    toolbar: {
      container: [
        [{ header: [2, 3, 4, false] }],
        ['bold', 'italic', 'underline', 'blockquote', 'code-block'],
        [{ color: [] }],
        [
          { list: 'ordered' },
          { list: 'bullet' },
          { indent: '-1' },
          { indent: '+1' }
        ],
        ['link', 'image'],
        ['clean']
      ]
    },
    clipboard: {
      matchVisual: true
    }
  };

  const formats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'list',
    'bullet',
    'indent',
    'link',
    'image',
    'color',
    'clean',
    'code-block'
  ];

  return (
    <div className={styles.container}>
      <QuillEditor
        className={styles.editor}
        theme="snow"
        value={value}
        formats={formats}
        modules={modules}
        onChange={(value) => setValue(value)}
      />
      <Button
        variant="contained"
        onClick={onSubmit}
        style={{
          width: 'fit-content'
        }}
      >
        Submit
      </Button>
    </div>
  );
}
