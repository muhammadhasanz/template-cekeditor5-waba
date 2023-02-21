import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';
import { Plugin, icons } from '@ckeditor/ckeditor5-core';
import Widget from '@ckeditor/ckeditor5-widget/src/widget';
import Command from '@ckeditor/ckeditor5-core/src/command';

export default class Bold extends Plugin {
    static get requires() {
        return [BoldUI, BoldEditing];
    }
}

class BoldUI extends Plugin {
    init() {
        const editor = this.editor;

        editor.ui.componentFactory.add('boldm', () => {
            const command = editor.commands.get('boldm');
            const button = new ButtonView();

            button.set({
                label: 'Bold',
                keystroke: 'CTRL+B',
                tooltip: true,
                icon: icons.bold,
            });
            button.bind('isOn', 'isEnabled').to(command, 'value', 'isEnabled');

            this.listenTo(button, 'execute', () => editor.execute('boldm'));
            //     editor.model.change(writer => {
            //         var selection = editor.model.document.selection;
            //         let range = selection.getFirstRange();
            //         let text_selected;
            //         for (const item of range.getItems()) {
            //             text_selected = item.data;
            //         }
            //         if (typeof text_selected === 'undefined') {
            //             editor.model.insertContent(writer.createText('*'));
            //             writer.setSelection(range, 0);
            //         } else {
            //             text_selected = writer.createText(`*${text_selected}*`)
            //             editor.model.insertContent(text_selected);
            //         }

            //         // console.log(editor.model.document.getRoot())
            //         if (typeof text_selected === 'undefined') {
            //             editor.model.insertContent(writer.createText('*'));
            //         }
            //         editor.editing.view.focus();
            //     });
            // });

            return button;
        });
    }
}

class BoldEditing extends Plugin {
    static get requires() {
        return [Widget];
    }

    init() {
        this.editor.commands.add('boldm', new BoldCommand(this.editor));

        this.editor.keystrokes.set('CTRL+B', 'boldm');
    }
}

class BoldCommand extends Command {
    execute() {
        this.editor.model.change(writer => {
            var selection = this.editor.model.document.selection;
            let range = selection.getFirstRange();
            let text_selected;
            for (const item of range.getItems()) {
                text_selected = item.data;
            }
            if (typeof text_selected === 'undefined') {
                this.editor.model.insertContent(writer.createText('*'));
                writer.setSelection(range, 0);
            } else {
                text_selected = writer.createText(`*${text_selected}*`)
                this.editor.model.insertContent(text_selected);
            }
            if (typeof text_selected === 'undefined') {
                this.editor.model.insertContent(writer.createText('*'));
            }
            this.editor.editing.view.focus();
        });
    }
}


