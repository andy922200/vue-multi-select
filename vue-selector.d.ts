import Vue, {
    PluginFunction, VueConstructor 
} from 'vue'

import {
    VueSelectorModule
} from './vue-selector-module'

export { VueSelectorModule }

declare const VueSelectorInstall: PluginFunction<any>
export default VueSelectorInstall

export const VueSelector: VueConstructor<Vue>
