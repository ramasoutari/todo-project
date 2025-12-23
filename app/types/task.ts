import { taskStatus } from "../enum/task";


export type ITask ={
    id:string;
    title:string;
    status:taskStatus;
}