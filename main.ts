import { App, Modal, Plugin, Setting } from 'obsidian';

interface Task {
	name: string,
	length: number
}

export default class AnotherTaskManager extends Plugin {

	async onload() {
		console.log('Another Task Manager: Loaded');

		this.addCommand({
			'id': 'atm-new-task',
			'name': 'New Task',
			'editorCallback': (editor) => {
				new TaskModal(this.app, (tasks) => {
					const taskText: string[] = [];
					let startTime = new Date(Date.now()).setMinutes((Math.ceil(new Date(Date.now()).getMinutes() / 5) * 5), 0, 0);
					tasks.forEach((task, idx) => {
						const taskTime = new Date(startTime += ((tasks[idx - 1]?.length ?? 0) * 1000 * 60));
						const timeText = `${taskTime.getHours()}:${taskTime.getMinutes() > 9 ? taskTime.getMinutes() : '0' + taskTime.getMinutes()}`;
						taskText.push(`- [ ] ${timeText} - ${task.name}`)
					});
					editor.replaceRange(taskText.join('\n'), editor.getCursor());
				}).open();
			}
		})
	}

	onunload() {
		console.log('Another Task Manager: Unloaded');
	}
}

class TaskModal extends Modal {
	tasks: Task[];
	taskCount: number;
	onSubmit: (tasks: Task[]) => void;

	constructor(app: App, onSubmit: (tasks: Task[]) => void) {
		super(app);
		this.taskCount = 0;
		this.onSubmit = onSubmit;
		this.tasks = [];
	}

	private createTask() {
		const { contentEl } = this;
		const idx = this.taskCount++;
		//const thisTask = contentEl.childNodes[idx]
		this.tasks.push({
			name: String(this.taskCount),
			length: 5
		})
		new Setting(contentEl)
			.setName(`Task ${this.taskCount}`)
			.addText((text) => {
				text.setPlaceholder('Name')
					.onChange((name) => {
						this.tasks[idx].name = name
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
						this.tasks[idx].length = parseInt(choice);
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
		contentEl.setText('Create new task schedule');
		new Setting(contentEl)
			.addButton((newTask) => {
				newTask
					.setButtonText('New Task')
					.setTooltip('Create a new task in the list', { 'placement': 'top' })
					.onClick((_ev) => {
						this.createTask();
					})
			})
			.addButton((create) => {
				create
					.setButtonText('Create')
					.setTooltip('Finalize and Create Routine', { 'placement': 'top' })
					.setCta()
					.onClick((_ev) => {
						this.close();
						this.onSubmit(this.tasks);
					});
			});
		this.createTask();

	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}
}
