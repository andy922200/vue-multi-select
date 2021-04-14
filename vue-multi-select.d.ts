import Vue, {
    PluginFunction, VueConstructor 
} from 'vue'

import {
    VueMultiSelectModule
} from './vue-multi-select-module'

export { VueMultiSelectModule }

declare const VueMultiSelectInstall: PluginFunction<any>
export default VueMultiSelectInstall

export const VueMultiSelect: VueConstructor<Vue>
