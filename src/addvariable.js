import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import Widget from '@ckeditor/ckeditor5-widget/src/widget';
import Command from '@ckeditor/ckeditor5-core/src/command';
import { toWidget, viewToModelPositionOutsideModelElement } from '@ckeditor/ckeditor5-widget/src/utils';
import { ContextualBalloon, clickOutsideHandler } from '@ckeditor/ckeditor5-ui';
import findAttributeRange from '@ckeditor/ckeditor5-typing/src/utils/findattributerange';
import FormView from './addvariableform';
import './styles.css';

export default class AddVariable extends Plugin {
    static get requires() {
        return [AddVariableUI, AddVariableEditing];
    }
}

class AddVariableUI extends Plugin {
    // static get requires() {
    //     return [ContextualBalloon];
    // }
    init() {
        const editor = this.editor;
        // this._balloon = this.editor.plugins.get(ContextualBalloon);
        // this.formView = this._createFormView();

        editor.ui.componentFactory.add('addvariable', () => {
            const command = editor.commands.get('addvariable');
            const button = new ButtonView();
            // window.variable = 1;

            button.set({
                label: 'Add Parameter',
                tooltip: true,
                icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path opacity="0.3" d="M3 13V11C3 10.4 3.4 10 4 10H20C20.6 10 21 10.4 21 11V13C21 13.6 20.6 14 20 14H4C3.4 14 3 13.6 3 13Z" fill="currentColor"/><path d="M13 21H11C10.4 21 10 20.6 10 20V4C10 3.4 10.4 3 11 3H13C13.6 3 14 3.4 14 4V20C14 20.6 13.6 21 13 21Z" fill="currentColor"/></svg>',
                withText: true
            });

            button.bind('isOn', 'isEnabled').to(command, 'value', 'isEnabled');

            this.listenTo(button, 'execute', () => {
                editor.execute('addvariable');
                // this._showUI();
            });

            return button;
        });
    }
    // _createFormView() {
    //     const editor = this.editor;
    //     const formView = new FormView(editor.locale);

    //     // Execute the command after clicking the "Save" button.
    //     this.listenTo(formView, 'submit', () => {
    //         // Grab values from the abbreviation and title input fields.
    //         const value = { variable: formView.variableInputView.fieldView.element.value };
    //         editor.execute('addvariable', value);

    //         // Hide the form view after submit.
    //         this._hideUI();
    //     });

    //     // Hide the form view after clicking the "Cancel" button.
    //     this.listenTo(formView, 'cancel', () => {
    //         this._hideUI();
    //     });

    //     // Hide the form view when clicking outside the balloon.
    //     clickOutsideHandler({
    //         emitter: formView,
    //         activator: () => this._balloon.visibleView === formView,
    //         contextElements: [this._balloon.view.element],
    //         callback: () => this._hideUI()
    //     });

    //     return formView;
    // }

    // _showUI() {
    //     const selection = this.editor.model.document.selection;

    //     // Check the value of the command.
    //     const commandValue = this.editor.commands.get('addvariable').value;

    //     this._balloon.add({
    //         view: this.formView,
    //         position: this._getBalloonPositionData()
    //     });

    //     // Disable the input when the selection is not collapsed.
    //     // this.formView.variableInputView.isEnabled = selection.getFirstRange().isCollapsed;

    //     // Fill the form using the state (value) of the command.
    //     if (commandValue) {
    //         this.formView.variableInputView.fieldView.value = commandValue.variable;
    //     }

    //     this.formView.focus();
    // }

    // _hideUI() {
    //     // Clear the input field values and reset the form.
    //     this.formView.variableInputView.fieldView.value = '';
    //     this.formView.element.reset();

    //     this._balloon.remove(this.formView);

    //     // Focus the editing view after inserting the abbreviation so the user can start typing the content
    //     // right away and keep the editor focused.
    //     this.editor.editing.view.focus();
    // }

    // _getBalloonPositionData() {
    //     const view = this.editor.editing.view;
    //     const viewDocument = view.document;
    //     let target = null;

    //     // Set a target position by converting view selection range to DOM
    //     target = () => view.domConverter.viewRangeToDom(viewDocument.selection.getFirstRange());

    //     return {
    //         target
    //     };
    // }
}

class AddVariableEditing extends Plugin {
    static get requires() {
        return [Widget];
    }

    init() {

        this._defineSchema();
        this._defineConverters();

        this.editor.commands.add('addvariable', new AddVariableCommand(this.editor));

        this.editor.editing.mapper.on(
            'viewToModelPosition',
            viewToModelPositionOutsideModelElement(this.editor.model, viewElement => viewElement.hasClass('addvariable'))
        );
    }

    _defineSchema() {
        const schema = this.editor.model.schema;

        schema.register('addvariable', {
            // Allow wherever text is allowed:
            allowWhere: '$text',

            // The placeholder will act as an inline node:
            isInline: true,

            // The inline widget is self-contained so it cannot be split by the caret and it can be selected:
            isObject: true,

            // The inline widget can have the same attributes as text (for example linkHref, bold).
            allowAttributesOf: '$text',

            // The placeholder can have many types, like date, name, surname, etc:
            allowAttributes: ['name']
        });
    }

    _defineConverters() {
        const conversion = this.editor.conversion;

        conversion.for('upcast').elementToElement({
            view: {
                name: 'span',
                classes: ['addvariable']
            },
            model: (viewElement, { writer: modelWriter }) => {
                const name = viewElement.getChild(0).data.replace(/\{\{(.*?)\}\}/, '$1');

                return modelWriter.createElement('addvariable', { name });
            }
        });

        conversion.for('editingDowncast').elementToElement({
            model: 'addvariable',
            view: (modelItem, { writer: viewWriter }) => {
                const widgetElement = createPlaceholderView(modelItem, viewWriter);

                // Enable widget handling on a placeholder element inside the editing view.
                return toWidget(widgetElement, viewWriter);
            }
        });

        conversion.for('dataDowncast').elementToElement({
            model: 'addvariable',
            view: (modelItem, { writer: viewWriter }) => createPlaceholderView(modelItem, viewWriter)
        });

        // Helper method for both downcast converters.
        function createPlaceholderView(modelItem, viewWriter) {
            const name = modelItem.getAttribute('name');
            const placeholderView = viewWriter.createContainerElement('span', {
                class: 'addvariable'
            });

            // Insert the placeholder name (as a text).
            const innerText = viewWriter.createText('{{' + name + '}}');
            viewWriter.insert(viewWriter.createPositionAt(placeholderView, 0), innerText);

            return placeholderView;
        }
    }
}

class AddVariableCommand extends Command {
    // execute({ variable }) {
    execute() {
        const editor = this.editor;
        const selection = editor.model.document.selection;

        let parameter;
        let content = editor.getData();
        content = content.match(/\{\{(.*?)\}\}/gm);
        if (content) {
            content.forEach((cValue, cIndex) => {
                content[cIndex] = cValue.replace(/\{\{(.*?)\}\}/gm, "$1")
            });
            content = content.sort(((t, e) => t - e));
            let t = content[content.length - 1]; t = t.replace(/\{\{(.*?)\}\}/gm, "$1")
            parameter = parseInt(t) + 1
        } else parameter = 1;


        editor.model.change(writer => {
            // Create a <placeholder> element with the "name" attribute (and all the selection attributes)...
            const placeholder = writer.createElement('addvariable', {
                ...Object.fromEntries(selection.getAttributes()),
                name: parameter
            });

            editor.model.insertContent(placeholder);
            editor.editing.view.focus();
        });
    }

    // refresh() {
    //     const model = this.editor.model;
    //     const selection = model.document.selection;
    //     const firstRange = selection.getFirstRange();

    // When the selection is collapsed, the command has a value if the caret is in an abbreviation.
    // if (firstRange.isCollapsed) {
    // if (selection.hasAttribute('addvariable')) {
    //     const attributeValue = selection.getAttribute('addvariable');

    //     // Find the entire range containing the abbreviation under the caret position.
    //     const abbreviationRange = findAttributeRange(selection.getFirstPosition(), 'addvariable', attributeValue, model);

    //     this.value = {
    //         variable: getRangeText(abbreviationRange),
    //         range: abbreviationRange
    //     };
    // } else {
    //     this.value = null;
    // }
    // }
    // if (firstRange.isCollapsed) {
    //     for (const item of firstRange.getItems()) {
    //         this.value = {
    //             variable: item.data,
    //             range: firstRange
    //         };
    //     }
    // } else {
    //     this.value = null;
    // }
    // When the selection is not collapsed, the command has a value if the selection contains a subset of a single abbreviation
    // or an entire abbreviation.
    // else {
    //     if (selection.hasAttribute('addvariable')) {
    //         const attributeValue = selection.getAttribute('addvariable');

    //         // Find the entire range containing the abbreviation under the caret position.
    //         const abbreviationRange = findAttributeRange(selection.getFirstPosition(), 'addvariable', attributeValue, model);

    //         if (abbreviationRange.containsRange(firstRange, true)) {
    //             this.value = {
    //                 variable: getRangeText(firstRange),
    //                 range: firstRange
    //             };
    //         } else {
    //             this.value = null;
    //         }
    //     } else {
    //         this.value = null;
    //     }
    // }

    // The command is enabled when the "abbreviation" attribute can be set on the current model selection.
    // this.isEnabled = true
    // this.isEnabled = model.schema.checkAttributeInSelection(selection, 'addvariable');
    // }
}

function getRangeText(range) {
    return Array.from(range.getItems()).reduce((rangeText, node) => {
        if (!(node.is('text') || node.is('textProxy'))) {
            return rangeText;
        }

        return rangeText + node.data;
    }, '');
}
