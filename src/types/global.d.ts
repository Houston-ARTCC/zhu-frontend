export declare global {
    interface ObjectConstructor {
        entries<Key extends PropertyKey, Value>(obj: Record<Key, Value>): [Key, Value][];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        keys<Key extends PropertyKey>(obj: Record<Key, any>): Key[];
    }
}
