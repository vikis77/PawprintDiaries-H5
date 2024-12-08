declare module 'pinia' {
    import { DefineStoreOptions } from '@pinia/types'
    export function defineStore<Id extends string>(
        id: Id,
        options: DefineStoreOptions<Id, any, any, any>
    ): any
    export function defineStore<Id extends string>(
        id: Id,
        storeSetup: () => any,
    ): any
} 