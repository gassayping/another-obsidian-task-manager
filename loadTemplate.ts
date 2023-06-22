import { Modal, App, Setting, TFile, Notice } from 'obsidian';
import { Breakdown } from 'types';

export default class LoadTemplateModal extends Modal {
	selection: TFile;
	startTime: number[];
	onSubmit: (breakdown: Breakdown) => void;

	constructor(app: App, onSubmit: (breakdown: Breakdown) => void) {
		super(app);
		this.onSubmit = onSubmit;
	}

	onOpen() {
		const { contentEl } = this;
		contentEl.setText('Select Template to Load');
		const templates = this.app.vault.getFiles().filter((file) => file.parent?.name === 'ATM_Templates');
		if (!(templates.length > 0)) {
			new Notice('You have no templates available');
			this.close();
			return;
		}
		this.selection = templates[0];
		new Setting(contentEl)
			.addDropdown((dropdown) => {
				const fileNames = templates.map((v) => v.basename) as string[]
				dropdown
					//@ts-expect-error
					.addOptions(fileNames)
					.onChange((choice) => {
						this.selection = templates[parseInt(choice)];
					})
			})
			.addText((text) => {
				text
					.setPlaceholder('Start Time')
					.onChange((time) => this.startTime = time.split(':', 2).map(Number));
			})
			.addButton(async (button) => {
				button
					.setButtonText('Select')
					.setCta()
					.onClick(async () => {
						this.close();
						const string = await this.app.vault.read(this.selection);
						const breakdown = JSON.parse(string) as Breakdown;
						breakdown.startTime = this.startTime;
						this.onSubmit(breakdown);
					})
			});
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}

}
