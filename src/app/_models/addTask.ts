export class AddTask {
  task: string;
  
}
export class AddTaskRes extends AddTask{
  success:string;
  data?:AddTask;
  message?:any ;
  err?:any; 
}
