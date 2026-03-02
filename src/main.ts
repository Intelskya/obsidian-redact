import { Editor, Plugin } from "obsidian";
import { RedactSettingsTab } from "./settings";

export enum redactBehavior{
	Ignore = "ignore",
	Redact = "redact",
	Delete = "delete"
}

export interface redactSettings {
	redactCharacter: string;
	behaviorSpaces: redactBehavior;
	behaviorSymbols: redactBehavior;
}

const DEFAULT_SETTINGS: Partial<redactSettings> = {
	redactCharacter: "█",
	behaviorSpaces: redactBehavior.Ignore,
	behaviorSymbols: redactBehavior.Delete,
};

export default class Redact extends Plugin {
	settings: redactSettings;

	async loadSettings() {
    const loaded = (await this.loadData()) as Partial<redactSettings>;
    this.settings = Object.assign({}, DEFAULT_SETTINGS, loaded) as redactSettings;
	}

	async saveSettings() {
    await this.saveData(this.settings);
	}

	async onload() {
		await this.loadSettings();
		this.addSettingTab(new RedactSettingsTab(this.app, this));

    	this.addCommand({
    	  id: 'expunge',
    	  name: 'Expunge selected text',
    	  editorCallback: (editor: Editor) => {
    	    const selection = editor.getSelection();
    	    editor.replaceSelection(this.redactedText(selection));
    	  },
    	});
  	}

  	redactedText(text:string): string {
		let controlChars = ["	","\n","\r","\v","\f","█"];
		let redactedText = "";
		for (let char of text.split("")){
			if(controlChars.contains(char)) {
				redactedText += char;
				continue;
			}
			if(char == " "){
				switch(this.settings.behaviorSpaces){
					case redactBehavior.Delete: continue;
					case redactBehavior.Ignore: {
						redactedText += char;
						continue;
					}
				}
			}
			else if(!/^[\p{L}\p{N}]$/u.test(char)){
				switch(this.settings.behaviorSymbols){
					case redactBehavior.Delete: continue;
					case redactBehavior.Ignore: {
						redactedText += char;
						continue;
					}
				}
			}
			redactedText += this.settings.redactCharacter;
		}
		return redactedText;
  	}
}	