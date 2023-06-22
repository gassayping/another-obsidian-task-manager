export interface Task {
	name: string,
	length: number
}

export interface Breakdown {
	title: string,
	startTime: number[],
	tasks: Task[]
}
