<template>
    <div class="dropdown__wrapper">
        <div
            ref="vueSelector"
            class="dropdown"
            @click.stop="changeToggleStatus"
        >
            <button
                type="button"
                class="btn btn-light btn__light dropdown__toggle"
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
                    <slot
                        name="closeBtn"
                        :closeMethod="closeMethod"
                    >
                        <button
                            v-if="defaultButtonOptions.close && !defaultButtonOptions.close.hide"
                            type="button"
                            class="btn btn-secondary btn__secondary dropdownBtn__format"
                            @click.stop.self="closeMethod"
                        >
                            {{ defaultButtonOptions.close.name }}
                        </button>
                    </slot>
                    <slot name="applyBtn">
                        <button
                            v-if="defaultButtonOptions.apply && !defaultButtonOptions.apply.hide"
                            type="button"
                            class="btn btn-primary btn__primary dropdownBtn__format"
                        >
                            {{ defaultButtonOptions.apply.name }}
                        </button>
                    </slot>
                    <slot name="selectAllBtn">
                        <button
                            v-if="defaultButtonOptions.selectAll && !defaultButtonOptions.selectAll.hide"
                            type="button"
                            class="btn btn-info btn__info dropdownBtn__format"
                        >
                            {{ defaultButtonOptions.selectAll.name }}
                        </button>
                    </slot>
                    <slot name="clearBtn">
                        <button
                            v-if="defaultButtonOptions.clear && !defaultButtonOptions.clear.hide"
                            type="button"
                            class="btn btn-danger btn__danger dropdownBtn__format"
                        >
                            {{ defaultButtonOptions.clear.name }}
                        </button>
                    </slot>
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
$typeList: (
    'primary',
    'secondary',
    'success',
    'info',
    'warning',
    'danger',
    'light',
    'dark'
);

$colors:(
    primary:#007bff,
    secondary: #6c757d,
    success: #28a745,
    info:#17a2b8,
    warning:#ffc107,
    danger:#dc3545,
    light:#e3e6e9,
    dark:#343a40
);

.btn{
    display:inline-block;
    padding:0.3em 1.2em;
    margin:0 0.1em 0.1em 0;
    border:0.16em solid rgba(255,255,255,0);
    border-radius:2em;
    box-sizing: border-box;
    text-decoration:none;
    color:#FFFFFF;
    text-shadow: 0 0.04em 0.04em rgba(0,0,0,0.35);
    text-align:center;
    transition: all 0.2s;
    &:hover{
        border-color:#a7a6a6;
    }
    &:focus{
        outline: unset;
    }
}

@each $type in $typeList{
    @if ($type == 'light'){
        .btn__#{$type}{
            background-color: map-get($colors, $type);
            color:#000000;
        }
    }@else{
        .btn__#{$type}{
            background-color: map-get($colors, $type);
        }
    }
}

.dropdown__wrapper{
    position: relative;
    display: inline-block;

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
}
</style>