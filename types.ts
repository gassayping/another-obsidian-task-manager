export interface Task {
	name: string,
	length: number
}

export interface Schedule {
	title: string,
	startTime: number[],
	tasks: Task[]
}
