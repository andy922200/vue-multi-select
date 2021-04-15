<template>
    <div class="dropdown__wrapper">
        <div
            ref="vueSelector"
            class="dropdown"
            @click.stop.self="changeToggleStatus"
        >
            <button
                type="button"
                class="btn btn-light btn__light dropdown__toggle"
                @click.stop.self="changeToggleStatus"
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
                            @click.stop="closeMethod"
                        >
                            <span>{{ defaultButtonOptions.close.name }}</span>
                        </button>
                    </slot>
                    <slot 
                        name="applyBtn"
                        :applyMethod="applyMethod"
                    >
                        <button
                            v-if="defaultButtonOptions.apply && !defaultButtonOptions.apply.hide"
                            type="button"
                            class="btn btn-primary btn__primary dropdownBtn__format"
                            @click.stop="applyMethod"
                        >
                            <span>{{ defaultButtonOptions.apply.name }}</span>
                        </button>
                    </slot>
                    <slot 
                        name="selectAllBtn"
                        :selectAllMethod="selectAllMethod"
                    >
                        <button
                            v-if="defaultButtonOptions.selectAll && !defaultButtonOptions.selectAll.hide && !single && (limit === Infinity)"
                            type="button"
                            class="btn btn-info btn__info dropdownBtn__format"
                            @click.stop="selectAllMethod"
                        >
                            <span>{{ defaultButtonOptions.selectAll.name }}</span>
                        </button>
                    </slot>
                    <slot 
                        name="clearBtn"
                        :clearSelectedOptionsMethod="clearSelectedOptionsMethod"
                    >
                        <button
                            v-if="defaultButtonOptions.clear && !defaultButtonOptions.clear.hide"
                            type="button"
                            class="btn btn-danger btn__danger dropdownBtn__format"
                            @click.stop="clearSelectedOptionsMethod"
                        >
                            <span>{{ defaultButtonOptions.clear.name }}</span>
                        </button>
                    </slot>
                </div>

                <br>

                <div class="dropdown__searchField">
                    <input
                        v-model="searchQuery"
                        type="text"
                        class="dropdown__searchBar dropdown__searchBarFormat"
                        :placeholder="placeHolderText"
                    >
                </div>

                <div id="dropdown__filterOptionsWrapper">
                    <!--Spinner-->
                    <slot name="spinner">
                        <div
                            v-if="isFetching"
                            class="dropdown__spinnerOverlay"
                        >
                            <div class="cv-spinner">
                                <span class="spinner" />
                            </div>
                        </div>
                    </slot>
                    <!--Options Area-->
                    <div class="dropdown__optionsArea">
                        <template v-if="groupMode">
                            <div 
                                v-for="(group, groupIndex) in groupModeOptions.data" 
                                :key="groupIndex" 
                                class="dropdown__groupWrapper"
                            >
                                <h6
                                    v-if="filterItems(group).length > 0"
                                    class="dropdown__groupTitle"
                                >
                                    {{ groupModeOptions.list[groupIndex] }}
                                </h6>
                                <div 
                                    v-for="(option) in filterItems(group)"
                                    :key="`option${option.label}`"
                                    class="dropdown__optionWrapper"
                                >
                                    <input 
                                        :id="`option${option.label}`" 
                                        v-model="selectedOptions" 
                                        type="checkbox" 
                                        :value="option"
                                        :disabled="(single && selectedOptions.length >= 1 && selectedOptions.indexOf(option) === -1) || 
                                            (selectedOptions.length >= limit && selectedOptions.indexOf(option) === -1)
                                        "
                                    >
                                    <label :for="`option${option.label}`">
                                        {{ option.label }}
                                    </label>
                                </div>
                            </div>
                        </template>

                        <template v-else>
                            <div 
                                v-for="(option,index) in filterItems(options)"
                                :key="`option${index}`"
                                class="dropdown__optionWrapper"
                            >
                                <input 
                                    :id="`option${index}`" 
                                    v-model="selectedOptions" 
                                    type="checkbox" 
                                    :value="option"
                                    :disabled="(single && selectedOptions.length >= 1 && selectedOptions.indexOf(option) === -1) || 
                                        (selectedOptions.length >= limit && selectedOptions.indexOf(option) === -1)
                                    "
                                >
                                <label :for="`option${index}`">
                                    {{ option.label }}
                                </label>
                            </div>
                        </template>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import {
    VueMultiSelectModule 
} from '../../vue-multi-select'

export default Vue.extend({
    name: 'VueSelector',
    props: {
        single: {
            type: Boolean,
            required: false,
            default: false
        },
        limit: {
            type: Number,
            required: false,
            default: Infinity
        },
        isFetching: {
            type: Boolean,
            required: false,
            default: false
        },
        selectorTitle: {
            type: String,
            required: true,
            default: '',
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
        },
        options: {
            type: Array,
            required: false,
            default(){
                return []
            }
        },
        groupMode: {
            type: Boolean,
            default: false,
            required: false
        }
    },
    data():VueMultiSelectModule.SelectorData{
        return{
            searchQuery: '',
            selectedOptions: [],
            previousSavedOptions: [],
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
    computed: {
        groupModeOptions(){
            const result = this.$props.options.reduce((acc:any, item:any)=>{
                const group = ( acc[`${item.groupName ? item.groupName : 'Not Set'}`] || [] )
                group.push(item)
                acc[`${item.groupName ? item.groupName : 'Not Set'}`] = group	
                return acc
            }, {
            })
            return {
                list: Object.keys(result),
                data: Object.values(result)
            }
        }
    },
    async created(){
        try{
            if(this.$props.buttonOptions){
                const keys = Object.keys(this.$props.buttonOptions)

                keys.forEach(key=>{
                    this.$data.defaultButtonOptions[key] = this.$props.buttonOptions[key]
                })
            }
        }catch(err){
            console.log(err)
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
            this.searchQuery = ''
            this.isSelectorOpen = false
            this.clearSelectedOptionsMethod()
        },
        changeToggleStatus(e: Event){
            const rootInstance = this.$parent

            for(let i=0; i<rootInstance.$children.length; i++){
                if(rootInstance.$children[i].$refs.vueSelector){
                    rootInstance.$children[i].$data.searchQuery = ''
                    rootInstance.$children[i].$data.isSelectorOpen = false
                    rootInstance.$children[i].$data.selectedOptions = [ ... this.$data.previousSavedOptions]
                }
            }

            if(e.target instanceof HTMLElement && !this.$el.contains(e.target)){
                this.isSelectorOpen = false
                this.clearSelectedOptionsMethod()
            }else{
                this.isSelectorOpen = true
            } 
        },
        changeSpinnerStatus(status: boolean){
            this.$data.isFetching = status
        },
        filterItems: function(options:any) {
            const vm = this
            return options.filter(function(option:any) {
                let regex = new RegExp('(' + vm.$data.searchQuery + ')', 'i')
                return option.label
                    ?   option.label.match(regex)
                    :   ''
            })
        },
        applyMethod(){
            this.$data.previousSavedOptions = this.$data.selectedOptions
            this.$emit('getSelectedOptions', this.$data.previousSavedOptions)
            this.isSelectorOpen = false
        },
        selectAllMethod(){
            this.clearSelectedOptionsMethod()
            this.$data.selectedOptions.push(... this.$props.options)
        },
        clearSelectedOptionsMethod(){
            this.$data.selectedOptions = []
        }
    },
})
</script>

<style scoped lang="scss">
$rootFontSize: 13.3333333px;

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

.dropdown__wrapper{
    position: relative;
    display: inline-block;

    .btn{
        display:inline-block;
        padding:0.3*$rootFontSize 1.2*$rootFontSize;
        margin:0 0.1*$rootFontSize 0.1*$rootFontSize 0;
        border:0.16*$rootFontSize solid rgba(255,255,255,0);
        border-radius:2*$rootFontSize;
        box-sizing: border-box;
        text-decoration:none;
        color:#FFFFFF;
        text-shadow: 0 0.04*$rootFontSize 0.04*$rootFontSize rgba(0,0,0,0.35);
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

    .dropdown__buttonsArea{
        display:flex; 
        flex-wrap:nowrap;
    }

    .dropdownBtn__format{
        margin:0.005 * $rootFontSize;
    }

    .dropdown__toggle{
        white-space: nowrap;
        &:after{
            display: inline-block;
            margin-left: .255 * $rootFontSize;
            vertical-align: .255 * $rootFontSize;
            content: "";
            border-top: .3 * $rootFontSize solid;
            border-right: .3 * $rootFontSize solid transparent;
            border-bottom: 0;
            border-left: .3 * $rootFontSize solid transparent;
        }
    }

    .dropdown__menu{
        position: absolute;
        top: 100%;
        left: 0;
        z-index: 1000;
        float: left;
        min-width: 10 * $rootFontSize;
        padding: .5 * $rootFontSize 0;
        margin: .125 * $rootFontSize 0 0;
        font-size: 1 * $rootFontSize;
        color: #212529;
        text-align: left;
        list-style: none;
        background-color: #fff;
        background-clip: padding-box;
        border: 1px solid rgba(0,0,0,.15);
        border-radius: .25 * $rootFontSize;
        display: unset;
    }

    .dropdown__format{
        min-width: 320px;
        max-width: 400px;
        height: 300px;
        overflow: auto;
        padding: 10px;
    }

    .dropdown__searchField{
        text-align: center;
        .dropdown__searchBar{
            padding: 10px 10px 10px 40px;
            width: calc(100% - 50px);
            background: url(../images/search_icon.png) no-repeat scroll 7px 7px;
            &::placeholder{
                color:#a7a6a6;
            }
        }

        .dropdown__searchBarFormat{
            text-rendering: auto;
            color: #000000;
            letter-spacing: normal;
            word-spacing: normal;
            text-transform: none;
            text-indent: 0px;
            text-shadow: none;
            display: inline-block;
            text-align: start;
            appearance: auto;
            cursor: text;
            margin: 0;
            font: 400 $rootFontSize Arial;
            border-width: 2px;
            border-style: inset;
            border-image: initial;
            border-color:#000000;
            border-radius:2 * $rootFontSize;
            &:focus{
                outline:unset;
            }
        }
    }

    .dropdown__spinnerOverlay{
        margin-top: 10px;
        position:relative;
        .cv-spinner {
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;  
        }
        .spinner {
            width: 40px;
            height: 40px;
            border: 4px #ddd solid;
            border-top: 4px #2e93e6 solid;
            border-radius: 50%;
            animation: sp-anime 0.8s infinite linear;
        }
        @keyframes sp-anime {
            100% { 
                transform: rotate(360deg); 
            }
        }
    }

    .dropdown__groupWrapper{
        .dropdown__groupTitle{
            margin: 0.5 * $rootFontSize 0;
            font-size: 16px;
        }
    }

    .dropdown__optionsArea{
        margin:5px 0px;
    }

    .dropdown__optionWrapper{
        padding: 5px;
        display: flex;
        flex-wrap: nowrap;
        align-items: center;
        word-break: break-all;
        font-weight: 500;
        font-size: $rootFontSize*1.2;
        input{
            margin-right: 8px;
        }
    }
}
</style>