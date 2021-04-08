export namespace VueSelectorModule {
    interface buttonOption{
        name: string,
        hide: boolean,
    }

    interface buttonOptions{
        [key: string]: buttonOption
    }

    export interface SelectorData{
        searchQuery: string
        selectedOptions: Array<any>
        isSelectorOpen: boolean
        defaultButtonOptions: buttonOptions
    }
}