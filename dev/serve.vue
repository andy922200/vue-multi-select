<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
    name: 'ServeDev'
})
</script>

<template>
    <div id="app">
        <div style="display:flex; justify-content:center;">
            <vue-selector 
                selector-title="Test" 
                :button-options="{
                    close: { name: 'Close1', hide: false},
                    apply: { name: 'Apply1', hide: false},
                    selectAll: { name: 'SelectAll1', hide: false},
                    clear: { name: 'Clear1', hide: false},
                }"
                place-holder-text="placeHolderText"
            />
            <vue-selector 
                selector-title="Test2"
                place-holder-text="placeHolderText2"
            />
            <vue-selector 
                selector-title="Test3"
                place-holder-text="placeHolderText3"
            />
        </div>
    </div>
</template>
