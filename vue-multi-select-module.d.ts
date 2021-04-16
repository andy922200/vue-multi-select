export namespace VueMultiSelectModule {
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
        previousSavedOptions: Array<any>
        doubleLayerModeOptions: any
        doubleLayerGroupModeOptions: Array<any>
        selectedFatherOption: string
        isSelectorOpen: boolean
        isFatherLayerOpen: boolean
        isChildrenOptionFetching: boolean
        defaultButtonOptions: buttonOptions
    }
}