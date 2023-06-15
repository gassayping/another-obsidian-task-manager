import { Editor, Plugin } from 'obsidian';
import { Schedule } from 'types';
import NewTaskModal from 'newTask';
import LoadTemplateModal from 'loadTemplate';

export default class AnotherTaskManager extends Plugin {

	async onload() {
		console.log('Another Task Manager: Loaded');

		this.addCommand({
			'id': 'atm-new-task',
			'name': 'New Task',
			'icon': 'file-plus',
			'editorCallback': (editor) => {
				new NewTaskModal(this.app, (schedule) => {
					this.writeSchedule(schedule, editor)
				}).open();
			}
		});

		this.addCommand({
			'id': 'atm-new-template',
			'name': 'New Schedule Template',
			'icon': 'book-plus',
			'callback': () => {
				new NewTaskModal(this.app, async (schedule) => {
					const vault = this.app.vault
					try { await vault.createFolder('ATM_Templates') } catch { }
					vault.create(`ATM_Templates/${schedule.title}.md`, JSON.stringify(schedule));
				}).open();
			}
		});

		this.addCommand({
			'id': 'atm-load-template',
			'name': 'Load Schedule from Template',
			'editorCallback': (editor) => {
				new LoadTemplateModal(this.app, (schedule) => {
					this.writeSchedule(schedule, editor);
				}).open();
			}
		})
	}

	private writeSchedule(schedule: Schedule, editor: Editor) {
		const displayText = [`## ${schedule.title}`];
		let startTime = new Date(Date.now()).setMinutes((Math.ceil(new Date(Date.now()).getMinutes() / 5) * 5), 0, 0);
		schedule.tasks.forEach((task, idx) => {
			const taskTime = new Date(startTime += ((schedule.tasks[idx - 1]?.length ?? 0) * 1000 * 60));
			const timeText = `${taskTime.getHours()}:${taskTime.getMinutes() > 9 ? taskTime.getMinutes() : '0' + taskTime.getMinutes()}`;
			displayText.push(`- [ ] ${timeText} - ${task.name}`)
		});
		displayText.push('');
		editor.replaceRange(displayText.join('\n'), editor.getCursor());
		editor.setCursor(editor.getCursor().line + displayText.length);
	}

	onunload() {
		console.log('Another Task Manager: Unloaded');
	}
}
