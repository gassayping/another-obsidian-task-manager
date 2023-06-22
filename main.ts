import { Editor, Plugin } from 'obsidian';
import { Breakdown } from 'types';
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
				new NewTaskModal(this.app, (breakdown) => {
					this.writeBreakdown(breakdown, editor);
				}).open();
			}
		});

		this.addCommand({
			'id': 'atm-new-template',
			'name': 'New Breakdown Template',
			'icon': 'book-plus',
			'callback': () => {
				new NewTaskModal(this.app, async (breakdown) => {
					const vault = this.app.vault;
					vault.createFolder('ATM_Templates').catch(() => { })
						.finally(() => vault.create(`ATM_Templates/${breakdown.title}.md`, JSON.stringify(breakdown)))
				}).open();
			}
		});

		this.addCommand({
			'id': 'atm-load-template',
			'name': 'Load Breakdown from Template',
			'editorCallback': (editor) => {
				new LoadTemplateModal(this.app, (breakdown) => {
				this.writeBreakdown(breakdown, editor);
				}).open();
			}
		})
	}

	private writeBreakdown(breakdown: Breakdown, editor: Editor) {
		const displayText = [`## ${breakdown.title}`];
		let [hours, minutes] = breakdown.startTime
		breakdown.tasks.forEach((task, idx) => {
			minutes += breakdown.tasks[idx - 1]?.length ?? 0;
			if (minutes >= 60) {
				const carry = Math.floor(minutes / 60);
				hours += carry;
				minutes -= carry * 60;
			}
			const time = hours.toString() + (minutes > 9 ? ':' : ':0') + minutes.toString();
			displayText.push(`- [ ] ${time} - ${task.name}`);
		});
		displayText.push('');
		editor.replaceRange(displayText.join('\n'), editor.getCursor());
		editor.setCursor(editor.getCursor().line + displayText.length);
	}

	onunload() {
		console.log('Another Task Manager: Unloaded');
	}
}
