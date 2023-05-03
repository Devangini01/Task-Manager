export class Task {
	taskBy: string;
	task: string;
	fromDateTime: any;
	toDateTime: any;
}

export class TaskRes extends Task{
  success:string;
  data?:Task;
  message?:any ;
  err?:any;
}
