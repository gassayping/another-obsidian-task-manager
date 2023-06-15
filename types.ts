export interface Task {
	name: string,
	length: number
}

export interface Schedule {
	title: string,
	tasks: Task[]
}