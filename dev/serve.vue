<script lang="ts">
import Vue from 'vue'
import axios from 'axios'

export default Vue.extend({
    name: 'ServeDev',
    data(){
        return {
            jobData: [],
            isFetching: false,
            tests: [
                {
                    label: 'LabelA'
                },
                {
                    label: 'LabelB'
                },
                {
                    label: 'LabelC'
                }
            ]
        }
    },
    async mounted(){
        try{
            this.$data.isFetching = true
            const { data: rawData } = await axios.get('/positions.json?search=nodejs')
            const result = rawData.map((d:any)=>{
                const newObject = {
                    ... d 
                }
                newObject.label = d.title
                return newObject
            })
            this.$data.jobData.push(... result)
            this.$data.isFetching = false
        }catch(err){
            console.log(err)
        }
    },
    methods: {
        printValue(val:any){
            console.log('from inside', val)
        }
    }
})
</script>

<template>
    <div id="app">
        <div style="display:flex; justify-content:center;width:100%;">
            <vue-multi-select 
                selector-title="Test"
                :is-fetching="isFetching"
                :button-options="{
                    close: { name: 'Close1', hide: false},
                    apply: { name: 'Apply1', hide: false},
                    selectAll: { name: 'SelectAll1', hide: false},
                    clear: { name: 'Clear1', hide: false},
                }"
                :options="jobData"
                place-holder-text="placeHolderText"
                @getSelectedOptions="printValue"
            />
            <vue-multi-select
                selector-title="Test2"
                place-holder-text="placeHolderText2"
            />
            <vue-multi-select
                selector-title="Test3"
                place-holder-text="placeHolderText3"
            />
        </div>
    </div>
</template>