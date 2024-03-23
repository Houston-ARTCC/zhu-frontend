export type Paginated<T> = {
    count: number;
    next: string | null;
    previous: string | null;
    results: T[];
}

export interface SchemaError {
    non_field_errors?: [string];
}
