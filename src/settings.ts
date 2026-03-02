import Redact from './main';
import { redactBehavior } from './main';
import { App, PluginSettingTab, Setting } from 'obsidian';

export class RedactSettingsTab extends PluginSettingTab {
  plugin: Redact;

  constructor(app: App, plugin: Redact) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    let { containerEl } = this;

    containerEl.empty();

	new Setting(containerEl)  
    .setName('Redact character')  
    .setDesc('Redacted text content will be replaced with this character.')
    .addText((text) =>  
       text  
          .setPlaceholder("█")  
          .setValue(this.plugin.settings.redactCharacter)  
          .onChange(async (value) => {  
			if(!value) value = "█";
			this.plugin.settings.redactCharacter = value;
			await this.plugin.saveSettings();  
          })
    );

	new Setting(containerEl)  
    .setName('Spaces')
	.setDesc('Behavior for spaces in redacted text; default is "ignore".')
    .addDropdown((dropdown) =>  
       dropdown
    	.addOption(redactBehavior.Ignore, 'Ignore')  
    	.addOption(redactBehavior.Redact, 'Redact')  
    	.addOption(redactBehavior.Delete, 'Delete')  
    	.setValue(this.plugin.settings.behaviorSpaces)  
    	.onChange(async (value) => {  
             this.plugin.settings.behaviorSpaces = value as redactBehavior;
             await this.plugin.saveSettings();  
          })  
    );

	new Setting(containerEl)  
    .setName('Symbols')  
    .setDesc('Behavior for symbols in redacted text; default is "delete".')
    .addDropdown((dropdown) =>  
       dropdown  
          .addOption(redactBehavior.Ignore, 'Ignore')  
          .addOption(redactBehavior.Redact, 'Redact')  
          .addOption(redactBehavior.Delete, 'Delete')  
          .setValue(this.plugin.settings.behaviorSymbols)  
          .onChange(async (value) => {  
             this.plugin.settings.behaviorSymbols = value as redactBehavior;
             await this.plugin.saveSettings();  
          })  
    );
  }
}