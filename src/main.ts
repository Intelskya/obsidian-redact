import { Editor, Plugin } from "obsidian";
import { RedactSettingsTab } from "settings";

interface redactSettings {
	redactCharacter: string;
	ignoreSpaces: boolean;
	ignoreSymbols: boolean;
}

const DEFAULT_SETTINGS: Partial<redactSettings> = {
	redactCharacter: "█",
	ignoreSpaces: true,
	ignoreSymbols: true,
};


export default class Redact extends Plugin {
	settings: redactSettings;

	async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
    await this.saveData(this.settings);
	}

	async onload() {
		await this.loadSettings();
		this.addSettingTab(new RedactSettingsTab(this.app, this));

    	this.addCommand({
    	  id: 'redact',
    	  name: 'Redact selected text',
    	  editorCallback: (editor: Editor) => {
    	    const selection = editor.getSelection();
    	    editor.replaceSelection(this.redactedText(selection));
    	  },
    	});
		
  	}

  	redactedText(text:string): string {
		let controlChars = ["	","\n"]

		let redactedText = ""
		for (let char of text.split("")){
			if(controlChars.contains(char)) {
				redactedText += char;
				continue;
			}
			if(this.settings.ignoreSpaces && char == " "){
				redactedText += char;
				continue;
			}
			if(this.settings.ignoreSymbols && !/^[\p{L}\p{N}]$/u.test(char)){
				redactedText += char;
				continue;
			}
			redactedText += this.settings.redactCharacter;
		}
		return redactedText;
  	}
}	