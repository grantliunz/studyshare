import 'react-quill/dist/quill.snow.css';
import styles from './Editor.module.css';
import QuillEditor from 'react-quill';

type editorProps = {
  value: string;
  setValue: (value: string) => void;
};

export default function Editor({ value, setValue }: editorProps) {
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
      <div
        style={{
          height: '600px',
          overflow: 'hidden',
          paddingBottom: '60px'
        }}
      >
        <QuillEditor
          theme="snow"
          value={value}
          className={styles.editor}
          formats={formats}
          modules={modules}
          onChange={(value) => setValue(value)}
        />
      </div>
    </div>
  );
}
