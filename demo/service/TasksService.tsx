import { Demo } from '@/types';

export const TasksService = {
    getTasks() {
        return fetch('/demo/data/tasks.json', { headers: { 'Cache-Control': 'no-cache' } })
            .then((res) => res.json())
            .then((d) => d.data as Demo.Task[]);
    },
};
