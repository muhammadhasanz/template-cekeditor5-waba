import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor.js';
import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials.js';
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph.js';

import Bold from './bold.js';
import Code from './code.js';
import Italic from './italic.js';
import Strikethrough from './strikethrough.js';
import AddVariable from './addvariable.js';
// import Abbreviation from './abbreviation/abbreviation';
// import Placeholder from './placeholder';

class Editor extends ClassicEditor { }

Editor.builtinPlugins = [
	Bold,
	Code,
	AddVariable,
	Essentials,
	Italic,
	Strikethrough,
	Paragraph,
	// Abbreviation
	// Placeholder
];

// Editor configuration.
Editor.defaultConfig = {
	toolbar: {
		items: [
			'boldm',
			'|',
			'italicm',
			'|',
			'strikethroughm',
			'|',
			'code',
			'|',
			'addvariable',
			'|',
			// 'abbreviation',
			// '|',
			// 'placeholder',
			// '|',
			'undo',
			'redo'
		]
	},
	language: 'en'
};

export default Editor;
