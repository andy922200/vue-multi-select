export namespace VueMultiSelectModule {
    interface ButtonOption{
        name: string,
        hide: boolean,
    }

    interface ButtonOptions{
        [key: string]: ButtonOption
    }

    export interface DoubleLayerGroupModeOption{
        [key: string]: any
        label: string
        fatherOptionLabel: string
        groupName: string
        id: string | number
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
        defaultButtonOptions: ButtonOptions
    }
}