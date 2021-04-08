<script lang="ts">
import Vue from 'vue'
import axios from 'axios'

export default Vue.extend({
    name: 'ServeDev',
    data(){
        return {
            jobData: []
        }
    },
    async created(){
        try{
            const { data: rawData } = await axios.get('/positions.json?search=nodejs')
            const result = rawData.map((d:any)=>{
                const newObject = {
                    ... d 
                }
                newObject.label = d.title
                return newObject
            })
            this.$data.jobData.push(... result)
        }catch(err){
            console.log(err)
        }
    }
})
</script>

<template>
    <div id="app">
        <div style="display:flex; justify-content:center;width:100%;">
            <vue-selector 
                selector-title="Test" 
                :button-options="{
                    close: { name: 'Close1', hide: false},
                    apply: { name: 'Apply1', hide: false},
                    selectAll: { name: 'SelectAll1', hide: false},
                    clear: { name: 'Clear1', hide: false},
                }"
                :options="jobData"
                place-holder-text="placeHolderText"
            >
                <template #closeBtn="{closeMethod}">
                    <button
                        type="button"
                        class="btn btn-warning btn__warning dropdownBtn__format"
                        @click.stop.self="closeMethod"
                    >
                        Close
                    </button>
                </template>
            </vue-selector>
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
