<template>
    <div
        ref="vueSelector"
        class="btn-group dropdown"
        @click.stop="changeToggleStatus"
    >
        <button
            type="button"
            class="btn btn-light dropdown__toggle"
            @click.stop="changeToggleStatus"
        >
            {{ selectorTitle }}
            <span class="caret" />
        </button>
        <div 
            v-if="isSelectorOpen"
            class="dropdown__menu dropdown__format"
        >
            <div class="dropdown__buttonsArea">
                <button
                    v-if="defaultButtonOptions.close && !defaultButtonOptions.close.hide"
                    type="button"
                    class="btn btn-secondary dropdownBtn__format"
                    @click.stop.self="closeMethod"
                >
                    {{ defaultButtonOptions.close.name }}
                </button>
                <button
                    v-if="defaultButtonOptions.apply && !defaultButtonOptions.apply.hide"
                    type="button"
                    class="btn btn-primary dropdownBtn__format"
                >
                    {{ defaultButtonOptions.apply.name }}
                </button>
                <button
                    v-if="defaultButtonOptions.selectAll && !defaultButtonOptions.selectAll.hide"
                    type="button"
                    class="btn btn-info dropdownBtn__format"
                >
                    {{ defaultButtonOptions.selectAll.name }}
                </button>
                <button
                    v-if="defaultButtonOptions.clear && !defaultButtonOptions.clear.hide"
                    type="button"
                    class="btn btn-danger dropdownBtn__format"
                >
                    {{ defaultButtonOptions.clear.name }}
                </button>
            </div>

            <br>
            <input
                type="text"
                class="searchBar"
                :placeholder="placeHolderText"
            >
            <div id="linkedAccountDropdown__filterOptionsWrapper">
                <!--Spinner-->
                <div
                    id="linkedAccountDropdown__overlay"
                    class="spinnerOverlay"
                >
                    <div class="cv-spinner">
                        <span class="spinner" />
                    </div>
                </div>
                <!--Options Area-->
                <div
                    id="linkedAccountDropdown__filterOptions"
                    class="filter-options"
                />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import {
    VueSelectorModule 
} from '../../vue-selector'

export default Vue.extend({
    name: 'VueSelector',
    props: {
        selectorTitle: {
            type: String,
            required: true
        },
        placeHolderText: {
            type: String,
            required: false,
            default: ''
        },
        buttonOptions: {
            type: Object,
            default(){
                return {
                }
            }
        }
    },
    data():VueSelectorModule.SelectorData{
        return{
            isSelectorOpen: false,
            defaultButtonOptions: {
                close: {
                    name: 'Close',
                    hide: false,
                },
                apply: {
                    name: 'Apply',
                    hide: false,
                },
                selectAll: {
                    name: 'Select All',
                    hide: false,
                },
                clear: {
                    name: 'Clear',
                    hide: false,
                }
            }
        }
    },
    created(){
        if(this.$props.buttonOptions){
            const keys = Object.keys(this.$props.buttonOptions)

            keys.forEach(key=>{
                this.$data.defaultButtonOptions[key] = this.$props.buttonOptions[key]
            })
        }
    },
    mounted(){
        document.addEventListener('click', this.changeToggleStatus)
    },
    beforeDestroy() {
        document.removeEventListener('click', this.changeToggleStatus)
    },
    methods: {
        closeMethod(){
            this.isSelectorOpen = false
        },
        changeToggleStatus(e: Event){
            const rootInstance = this.$parent

            for(let i=0; i<rootInstance.$children.length; i++){
                if(rootInstance.$children[i].$refs.vueSelector){
                    rootInstance.$children[i].$data.isSelectorOpen = false
                }
            }

            e.target instanceof HTMLElement && !this.$el.contains(e.target)
                ?   this.isSelectorOpen = false
                :   this.isSelectorOpen = true
        }
    }
})
</script>

<style scoped lang="scss">
@import "../../node_modules/bootstrap/dist/css/bootstrap.min.css";

.dropdown__buttonsArea{
    display:flex; 
    flex-wrap:nowrap;
}

.dropdownBtn__format{
    margin:0.04rem;
}

.dropdown__toggle{
    white-space: nowrap;
    &:after{
        display: inline-block;
        margin-left: .255em;
        vertical-align: .255em;
        content: "";
        border-top: .3em solid;
        border-right: .3em solid transparent;
        border-bottom: 0;
        border-left: .3em solid transparent;
    }
}

.dropdown__menu{
    position: absolute;
    top: 100%;
    left: 0;
    z-index: 1000;
    float: left;
    min-width: 10rem;
    padding: .5rem 0;
    margin: .125rem 0 0;
    font-size: 1rem;
    color: #212529;
    text-align: left;
    list-style: none;
    background-color: #fff;
    background-clip: padding-box;
    border: 1px solid rgba(0,0,0,.15);
    border-radius: .25rem;
    display: unset;
}

.dropdown__format{
    min-width: 320px;
    max-width: 400px;
    height: 300px;
    overflow: auto;
    padding: 10px;
}
</style>