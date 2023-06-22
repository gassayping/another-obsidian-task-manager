import { App, Modal, Setting } from 'obsidian';
import { Breakdown } from 'types';


export default class NewTaskModal extends Modal {
	breakdown: Breakdown;
	taskCount: number;
	onSubmit: (breakdown: Breakdown) => void;

	constructor(app: App, onSubmit: (breakdown: Breakdown) => void) {
		super(app);
		this.taskCount = 0;
		this.onSubmit = onSubmit;
		this.breakdown = { title: '', startTime: [], tasks: [] };
	}

	private createTask() {
		const { contentEl } = this;
		const idx = this.taskCount++;
		//const thisTask = contentEl.childNodes[idx]
		this.breakdown.tasks.push({
			name: String(this.taskCount),
			length: 5
		})
		new Setting(contentEl)
			.setName(`Task ${this.taskCount}`)
			.addText((text) => {
				text.setPlaceholder('Name')
					.onChange((name) => {
						this.breakdown.tasks[idx].name = name
					})
			})

			.addDropdown((dropdown) => {
				dropdown
					.addOption('1', '1 Minute')
					.addOption('5', '5 Minutes')
					.addOption('10', '10 Minutes')
					.addOption('15', '15 Minutes')
					.addOption('20', '20 Minutes')
					.addOption('25', '25 Minutes')
					.addOption('30', '30 Minutes')
					.setValue('5')
					.onChange((choice) => {
						this.breakdown.tasks[idx].length = parseInt(choice);
					})
			})
		/* .addButton((button) => {
			button
				.setIcon('trash-2')
				.setTooltip('Delete Task', { 'placement': 'right' })
				.setWarning()
				.onClick((_ev) => {
					contentEl.removeChild(thisTask);
					this.taskCount--;
				})
		}) */
	}

	onOpen() {
		const { contentEl } = this;
		contentEl.setText('Create new task breakdown');
		new Setting(contentEl)
			.addText((text) => {
				text
					.setPlaceholder('Breakdown Name')
					.onChange((name) => {
						this.breakdown.title = name;
					})
			})
			.addButton((newTask) => {
				newTask
					.setButtonText('New Task')
					.setTooltip('Create a new task in the list', { 'placement': 'top' })
					.onClick((_ev) => {
						this.createTask();
					})
			})
			.addText((text) => {
				text
					.setPlaceholder('Start Time')
					.onChange((time) => {
						this.breakdown.startTime = time.split(':', 2).map(Number);
					})
			})

			.addButton((create) => {
				create
					.setButtonText('Create')
					.setTooltip('Finalize and Create Routine', { 'placement': 'top' })
					.setCta()
					.onClick((_ev) => {
						this.close();
						this.onSubmit(this.breakdown);
					});
			});
		this.createTask();

	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}
}
