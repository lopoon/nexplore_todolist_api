// interfaces.ts
export interface Todo {
    id: string;
    title: string;
    status: boolean;
    hash: string;
    created_at: Date;
    updated_at: Date;
}

export interface CreateTodoRequest {
    title: string;
    status: boolean;
}

export interface UpdateTodoRequest {
    title?: string;
    status?: boolean;
}