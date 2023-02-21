import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import Widget from '@ckeditor/ckeditor5-widget/src/widget';
import Command from '@ckeditor/ckeditor5-core/src/command';

export default class Italic extends Plugin {
    static get requires() {
        return [ItalicUI, ItalicEditing];
    }
}

class ItalicUI extends Plugin {
    init() {
        const editor = this.editor;

        editor.ui.componentFactory.add('italicm', () => {
            const command = editor.commands.get('italicm');
            const button = new ButtonView();

            button.set({
                label: 'Italic',
                keystroke: 'CTRL+I',
                tooltip: true,
                icon: '<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="m9.586 14.633.021.004c-.036.335.095.655.393.962.082.083.173.15.274.201h1.474a.6.6 0 1 1 0 1.2H5.304a.6.6 0 0 1 0-1.2h1.15c.474-.07.809-.182 1.005-.334.157-.122.291-.32.404-.597l2.416-9.55a1.053 1.053 0 0 0-.281-.823 1.12 1.12 0 0 0-.442-.296H8.15a.6.6 0 0 1 0-1.2h6.443a.6.6 0 1 1 0 1.2h-1.195c-.376.056-.65.155-.823.296-.215.175-.423.439-.623.79l-2.366 9.347z"/></svg>',
            });

            button.bind('isOn', 'isEnabled').to(command, 'value', 'isEnabled');

            this.listenTo(button, 'execute', () => editor.execute('italicm'));

            return button;
        });
    }
}

class ItalicEditing extends Plugin {
    static get requires() {
        return [Widget];
    }

    init() {
        this.editor.commands.add('italicm', new ItalicCommand(this.editor));

        this.editor.keystrokes.set('CTRL+I', 'italicm');
    }
}

class ItalicCommand extends Command {
    execute() {
        this.editor.model.change(writer => {
            var selection = this.editor.model.document.selection;
            const range = selection.getFirstRange();
            let text_selected;
            for (const item of range.getItems()) {
                text_selected = item.data;
            }
            if (typeof text_selected === 'undefined') {
                this.editor.model.insertContent(writer.createText('_'));
                writer.setSelection(range, 0);
            } else {
                text_selected = writer.createText(`_${text_selected}_`)
                this.editor.model.insertContent(text_selected);
            }

            if (typeof text_selected === 'undefined') {
                this.editor.model.insertContent(writer.createText('_'));
            }
            this.editor.editing.view.focus();
        });
    }
}
