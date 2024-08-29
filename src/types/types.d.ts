declare module 'a-local-database' {
    export default class Collection {
        constructor(name?: string);
        get<T>(key?: string): T;
        set(value: any): any;
    }
}