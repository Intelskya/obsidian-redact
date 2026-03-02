import Redact from './main';
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
    	.setName('Ignore spaces')  
    	.addToggle(toggle => toggle  
    	   .setValue(this.plugin.settings.ignoreSpaces)  
    	   .onChange(async (value) => {  
    	      this.plugin.settings.ignoreSpaces = value;  
    	      await this.plugin.saveSettings();  
    	      this.display();  
    	   })  
    	);

	new Setting(containerEl)  
    	.setName('Ignore symbols')
    	.addToggle(toggle => toggle  
    	   .setValue(this.plugin.settings.ignoreSymbols)  
    	   .onChange(async (value) => {  
    	      this.plugin.settings.ignoreSymbols = value;  
    	      await this.plugin.saveSettings();  
    	      this.display();  
    	   })  
    	);
  }
}