<script lang="ts">
import Vue from 'vue'
import axios from 'axios'

export default Vue.extend({
    name: 'ServeDev',
    data(){
        return {
            jobData: {
            },
            singleLayerData: [],
            isFetching: false,
            isFatherFetching: false,
            tests: [
                {
                    label: 'NodeJS',
                    value: 'nodejs'
                },
                {
                    label: 'Java',
                    value: 'java'
                },
                {
                    label: 'Python',
                    value: 'python'
                }
            ]
        }
    },
    async created(){
        try{
            this.$data.isFetching = true
            
            const result = await this.fetchData()

            this.$data.singleLayerData = result
            this.$data.isFetching = false
        }catch(err){
            console.log(err)
        }
    },
    methods: {
        async fetchData(query='', fatherOptionLabel=''){
            try{
                const { data: rawData } = await axios.get(`/positions.json?search=${query}`)
                const result = rawData.map((d:any)=>{
                    const newObject = {
                        ... d,
                        label: `${fatherOptionLabel} ${d.title}`,
                        fatherOptionLabel,
                        groupName: d.company ? d.company : 'N/A'
                    }
                    return newObject
                })
                return result
            }catch(err){
                console.log(err)
            }
        },
        async printValue(obj:any) {
            try{
                console.log('from inside', obj)                
            }catch(err){
                console.log(err)
            }
        }
    }
})
</script>

<template>
    <div id="app">
        <div style="display:flex; justify-content:center;width:100%;">
            <vue-multi-select 
                selector-title="DoubleLayer"
                :is-fetching="isFatherFetching"
                :button-options="{
                    close: { name: 'Close1', hide: false},
                    apply: { name: 'Apply1', hide: false},
                    selectAll: { name: 'SelectAll1', hide: false},
                    clear: { name: 'Clear1', hide: false},
                }"
                :double-layer-mode="true"
                :father-options="tests"
                :children-option-fetch-function="fetchData"
                place-holder-text="placeHolderText"
                @getSelectedOptions="printValue"
            />
            <vue-multi-select
                selector-title="SingleLayer"
                :is-fetching="isFetching"
                :group-mode="true"
                :options="singleLayerData"
                place-holder-text="placeHolderText2"
                @getSelectedOptions="printValue"
            />
            <vue-multi-select
                selector-title="Test3"
                place-holder-text="placeHolderText3"
            />
        </div>
    </div>
</template>