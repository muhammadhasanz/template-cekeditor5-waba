import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import Widget from '@ckeditor/ckeditor5-widget/src/widget';
import Command from '@ckeditor/ckeditor5-core/src/command';

export default class Strikethrough extends Plugin {
    static get requires() {
        return [StrikethroughUI, StrikethroughEditing];
    }
}

class StrikethroughUI extends Plugin {
    init() {
        const editor = this.editor;

        editor.ui.componentFactory.add('strikethroughm', () => {
            const command = editor.commands.get('strikethroughm');
            const button = new ButtonView();

            button.set({
                label: 'Strikethrough',
                keystroke: 'CTRL+SHIFT+X',
                tooltip: true,
                icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path opacity="0.3" d="M19.2 15.9C19.2 17.1 18.9 18.1 18.3 19.1C17.7 20 16.8 20.8 15.7 21.3C14.5 21.8 13.2 22.1 11.6 22.1C9.70002 22.1 8.10001 21.7 6.90001 21C6.00001 20.5 5.3 19.8 4.8 18.9C4.5 18.5 4.30002 18 4.10002 17.5C3.70002 15.7 6.00002 14.9 7.20002 16C7.70002 16.5 7.90002 17.2 8.20002 17.7C8.50002 18.1 8.90001 18.5 9.40001 18.7C9.90001 19 10.6 19.1 11.4 19.1C12.6 19.1 13.5 18.8 14.2 18.3C14.9 17.8 15.3 17.1 15.3 16.3C15.3 15.7 15.1 15.1 14.7 14.7C14.3 14.3 13.8 14 13.2 13.8C12.6 13.6 11.8 13.4 10.7 13.1C9.30002 12.8 8.10002 12.4 7.20002 12C6.30002 11.6 5.50001 11 5.00001 10.2C4.40001 9.39995 4.20002 8.50002 4.20002 7.40002C4.20002 6.30002 4.50002 5.39998 5.10002 4.59998C5.70002 3.79998 6.50002 3.09995 7.60002 2.69995C8.70002 2.29995 10 2 11.5 2C12.7 2 13.7 2.10002 14.6 2.40002C15.5 2.70002 16.2 3.09998 16.8 3.59998C17.7 4.39998 18.6 5.49995 18 6.69995C17.7 7.19995 17.2 7.60005 16.6 7.80005C16.1 7.90005 15.6 7.8 15.3 7.5C15.2 7.4 15 7.19998 14.9 7.09998C14.5 6.49998 14.2 5.90002 13.6 5.40002C13.1 5.00002 12.3 4.80005 11.2 4.80005C10.2 4.80005 9.4 5 8.8 5.5C8.2 6 7.90001 6.49998 7.90001 7.09998C7.90001 7.49998 8.00002 7.79998 8.20002 8.09998C8.40002 8.39998 8.70002 8.60005 9.10002 8.80005C9.50002 9.00005 9.80002 9.20005 10.2 9.30005C10.6 9.40005 11.2 9.60005 12.1 9.80005C13.2 10.1 14.2 10.3 15.1 10.6C16 10.9 16.7 11.3 17.4 11.7C18 12.1 18.5 12.7 18.9 13.4C19 14.1 19.2 14.9 19.2 15.9Z" fill="currentColor"/><path d="M3 12H20" stroke="currentColor" stroke-width="3" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/></svg>',
            });

            button.bind('isOn', 'isEnabled').to(command, 'value', 'isEnabled');

            this.listenTo(button, 'execute', () => editor.execute('strikethroughm'));

            return button;
        });
    }
}

class StrikethroughEditing extends Plugin {
    static get requires() {
        return [Widget];
    }

    init() {
        this.editor.commands.add('strikethroughm', new StrikethroughCommand(this.editor));

        this.editor.keystrokes.set('CTRL+SHIFT+X', 'strikethroughm');
    }
}

class StrikethroughCommand extends Command {
    execute() {
        this.editor.model.change(writer => {
            var selection = this.editor.model.document.selection;
            const range = selection.getFirstRange();
            let text_selected;
            for (const item of range.getItems()) {
                text_selected = item.data;
            }
            if (typeof text_selected === 'undefined') {
                this.editor.model.insertContent(writer.createText('~'));
                writer.setSelection(range, 0);
            } else {
                text_selected = writer.createText(`~${text_selected}~`)
                this.editor.model.insertContent(text_selected);
            }

            if (typeof text_selected === 'undefined') {
                this.editor.model.insertContent(writer.createText('~'));
            }
            this.editor.editing.view.focus();
        });
    }
}
