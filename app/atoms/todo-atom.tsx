import { atomWithStorage } from 'jotai/utils';
import { ITask } from '../types/task';

const initialTasks: ITask[] = [];

export const tasksAtom = atomWithStorage('todo-tasks', initialTasks);