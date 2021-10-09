import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

import {
	addToolbarToDropdown,
	createDropdown,
} from '@ckeditor/ckeditor5-ui/src/dropdown/utils';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';
import Collection from '@ckeditor/ckeditor5-utils/src/collection';
import mshapeIcon from './ckeditor5-test/theme/icons/mshape.svg';

export default class MshapeUI extends Plugin {
	init() {
		const editor = this.editor;
		const t = editor.t;
		//const mshapeNames = ["date", "first name", "surname"];
		const mshapeNames = editor.config.get('mshapeConfig.types');

		// The "mshape" dropdown must be registered among the UI components of the editor
		// to be displayed in the toolbar.
		editor.ui.componentFactory.add('mshape', (locale) => {
			const dropdownView = createDropdown(locale);

			// Populate the list in the dropdown with items.
			addToolbarToDropdown(
				dropdownView,
				getDropdownToolbarItems(mshapeNames)
			);

			dropdownView.buttonView.set({
				// The t() function helps localize the editor. All strings enclosed in t() can be
				// translated and change when the language of the editor changes.
				icon: mshapeIcon,
				//label: t("Mshape"),
				label: 'Şekil Ekle',
				tooltip: true,
				withText: false,
			});

			// Disable the mshape button when the command is disabled.
			const command = editor.commands.get('mshape');
			dropdownView.bind('isEnabled').to(command);

			// Execute the command when the dropdown item is clicked (executed).
			this.listenTo(dropdownView, 'execute', (evt) => {
				editor.execute('mshape', { value: evt.source.label });
				editor.editing.view.focus();
			});

			return dropdownView;
		});
	}
}

function getDropdownToolbarItems(mshapeNames) {
	const buttonsDefinitions = new Collection();

	for (const name of mshapeNames) {
		const definition = {
			// readonly children: ViewCollection;
			// class?: string;
			// icon?: string;
			// readonly iconView: IconView;
			//isEnabled: true,
			//isOn: true,
			// isToggleable: boolean;
			isVisible: true,
			// keystroke?: string;
			// readonly keystrokeView: View;
			label: name,
			// labelStyle?: string;
			// readonly labelView: View;
			// tabindex?: string;
			tooltip: false,
			// tooltipPosition?: "s" | "n" | "e" | "w" | "sw" | "se";
			// readonly tooltipView: TooltipView;
			type: 'button',
			// withKeystroke?: boolean;
			withText: true,
		};

		const view = new ButtonView();
		view.set(definition);
		view.render();

		// Add the item definition to the collection.
		buttonsDefinitions.add(view);
	}

	//console.log(buttonsDefinitions);

	return buttonsDefinitions;
}
