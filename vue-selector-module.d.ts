export namespace VueSelectorModule {
    interface buttonOption{
        name: string,
        hide: boolean,
    }

    interface buttonOptions{
        [key: string]: buttonOption
    }

    export interface SelectorData{
        isSelectorOpen: boolean
        defaultButtonOptions: buttonOptions
    }
}