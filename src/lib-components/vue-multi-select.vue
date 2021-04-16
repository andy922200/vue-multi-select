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
                <!-- General Part-->
                <div class="dropdown__buttonsArea">
                    <slot
                        name="closeBtn"
                        :closeMethod="closeMethod"
                    >
                        <button
                            v-if="defaultButtonOptions.close && !defaultButtonOptions.close.hide"
                            type="button"
                            class="btn btn__secondary dropdownBtn__format"
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
                            class="btn btn__primary dropdownBtn__format"
                            :disabled="isFetching || isChildrenOptionFetching"
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
                            class="btn btn__info dropdownBtn__format"
                            :disabled="(isFatherLayerOpen && doubleLayerMode) || (isFetching || isChildrenOptionFetching)"
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
                            class="btn btn__danger dropdownBtn__format"
                            :disabled="(isFatherLayerOpen && doubleLayerMode) || (isFetching || isChildrenOptionFetching)"
                            @click.stop="clearSelectedOptionsMethod"
                        >
                            <span>{{ defaultButtonOptions.clear.name }}</span>
                        </button>
                    </slot>
                </div>

                <br>

                <!-- Double Layer Only-->
                <template v-if="doubleLayerMode && isFatherLayerOpen">
                    <!--Spinner-->
                    <slot name="spinner">
                        <div
                            v-if="isFetching || isChildrenOptionFetching"
                            class="dropdown__spinnerOverlay"
                        >
                            <div class="cv-spinner">
                                <span class="spinner" />
                            </div>
                        </div>
                    </slot>
                    <template v-if="!isChildrenOptionFetching">
                        <a
                            v-for="(fatherOption,index) in fatherOptions"
                            :key="`${fatherOption.label},${index}`"
                            class="dropdown__linkBtn"
                            @click.stop.self="emitUserSelectedFatherOption(fatherOption)"
                        >
                            {{ fatherOption.label }}
                        </a>
                    </template>
                </template>

                <div
                    v-if="!isFatherLayerOpen || !doubleLayerMode"
                    class="dropdown__searchField"
                    :class="!isFatherLayerOpen || !doubleLayerMode ? 'dropdown__searchField--doubleLayer' : ''"
                >
                    <template v-if="doubleLayerMode && !isFatherLayerOpen">
                        <div class="backToFatherLayerBtn__wrapper">
                            <button
                                class="backToFatherLayerBtn btn btn__secondary dropdownBtn__format" 
                                @click.stop="goBackToFatherLayer()"
                            >
                                <span class="chevron left" />
                            </button>
                        </div>
                    </template>
                    <input
                        v-model="searchQuery"
                        type="text"
                        class="dropdown__searchBar dropdown__searchBarFormat"
                        :placeholder="placeHolderText"
                    >
                </div>

                <div class="dropdown__filterOptionsWrapper">
                    <div class="dropdown__optionsArea">
                        <!--Double Layer Mode Options Area-->
                        <template v-if="doubleLayerMode && !isFatherLayerOpen">
                            <template v-if="!groupMode && doubleLayerModeOptions.length !== 0">
                                <div 
                                    v-for="(option,index) in filterItems(doubleLayerModeOptions)"
                                    :key="`option${option.fatherOptionLabel}${index}`"
                                    class="dropdown__optionWrapper"
                                >
                                    <input 
                                        :id="`option${option.fatherOptionLabel}${index}`" 
                                        v-model="selectedOptions" 
                                        type="checkbox" 
                                        :value="option"
                                        :disabled="(single && selectedOptions.length >= 1 && selectedOptions.indexOf(option) === -1) || 
                                            (selectedOptions.length >= limit && selectedOptions.indexOf(option) === -1)
                                        "
                                    >
                                    <label :for="`option${option.fatherOptionLabel}${index}`">
                                        {{ option.label }}
                                    </label>
                                </div>
                            </template>

                            <template v-if="groupMode && doubleLayerModeOptions.length !== 0">
                                <div 
                                    v-for="(fatherLayerItems,index) in doubleLayerGroupModeOptions"
                                    :key="index"
                                >
                                    <template v-if="fatherLayerItems.type === selectedFatherOption">
                                        <div 
                                            v-for="(group, groupIndex) in fatherLayerItems.data" 
                                            :key="groupIndex" 
                                            class="dropdown__groupWrapper"
                                        >
                                            <h6
                                                v-if="filterItems(group).length > 0"
                                                class="dropdown__groupTitle"
                                            >
                                                {{ fatherLayerItems.list[groupIndex] }}
                                            </h6>
                                            <div 
                                                v-for="(option,subIndex) in filterItems(group)"
                                                :key="`${option.fatherOptionLabel}${option.id}${subIndex}`"
                                                class="dropdown__optionWrapper"
                                            >
                                                <input 
                                                    :id="`${option.fatherOptionLabel}${option.id}${subIndex}`" 
                                                    v-model="selectedOptions" 
                                                    type="checkbox" 
                                                    :value="option"
                                                    :disabled="(single && selectedOptions.length >= 1 && selectedOptions.indexOf(option) === -1) || 
                                                        (selectedOptions.length >= limit && selectedOptions.indexOf(option) === -1)
                                                    "
                                                >
                                                <label :for="`${option.fatherOptionLabel}${option.id}${subIndex}`">
                                                    {{ option.label }}
                                                </label>
                                            </div>
                                        </div>
                                    </template>
                                </div>
                            </template>
                        </template>
                        <!--Single Layer Mode Options Area-->
                        <template v-if="!doubleLayerMode">
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
        fatherOptions: {
            type: Array,
            required: false,
            default(){
                return []
            }
        },
        childrenOptionFetchFunction: {
            type: Function,
            required: false,
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
        },
        doubleLayerMode: {
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
            doubleLayerModeOptions: {
            },
            doubleLayerGroupModeOptions: [],
            selectedFatherOption: '',
            isSelectorOpen: false,
            isFatherLayerOpen: true,
            isChildrenOptionFetching: false,
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
            this.selectedFatherOption = ''
            this.isSelectorOpen = false
            this.isFatherLayerOpen = true
            this.clearSelectedOptionsMethod()
        },
        changeToggleStatus(e: Event){
            const rootInstance = this.$parent

            for(let i=0; i<rootInstance.$children.length; i++){
                if(rootInstance.$children[i].$refs.vueSelector){
                    rootInstance.$children[i].$data.searchQuery = ''
                    rootInstance.$children[i].$data.selectedFatherOption = ''
                    rootInstance.$children[i].$data.isSelectorOpen = false
                    rootInstance.$children[i].$data.isFatherLayerOpen = true
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
            if(options){
                if(vm.$props.doubleLayerMode && vm.$props.groupMode){
                    return options.filter(function(option:any) {
                        let regex = new RegExp('(' + vm.$data.searchQuery + ')', 'i')
                        return option.label
                            ?   option.label.match(regex)
                            :   ''
                    })
                }

                if(vm.$props.doubleLayerMode && !vm.$props.groupMode){
                    return options[vm.$data.selectedFatherOption].filter(function(option:any) {
                        let regex = new RegExp('(' + vm.$data.searchQuery + ')', 'i')
                        return option.label
                            ?   option.label.match(regex)
                            :   ''
                    })
                }

                return options.filter(function(option:any) {
                    let regex = new RegExp('(' + vm.$data.searchQuery + ')', 'i')
                    return option.label
                        ?   option.label.match(regex)
                        :   ''
                })
            }
        },
        applyMethod(){
            this.$data.previousSavedOptions = this.$data.selectedOptions
            this.$emit('getSelectedOptions', this.$data.previousSavedOptions)
            this.isSelectorOpen = false
        },
        selectAllMethod(){
            if(this.$props.doubleLayerMode){
                const otherFatherOptionItems = this.$data.selectedOptions.filter((item:any)=>{
                    return item.fatherOptionLabel !== this.$data.selectedFatherOption
                })

                const rawData = [
                    ... otherFatherOptionItems,
                    ... this.$data.doubleLayerModeOptions[this.$data.selectedFatherOption]
                ]

                this.$data.selectedOptions = []
                this.$data.selectedOptions.push(... rawData)
            }else{
                this.clearSelectedOptionsMethod()
                this.$data.selectedOptions.push(... this.$props.options)
            }
        },
        clearSelectedOptionsMethod(){
            if(this.$props.doubleLayerMode){
                const otherFatherOptionItems = this.$data.selectedOptions.filter((item:any)=>{
                    return item.fatherOptionLabel !== this.$data.selectedFatherOption
                })
                
                this.$data.selectedOptions = []
                this.$data.selectedOptions.push(... otherFatherOptionItems)
            }else{
                this.$data.selectedOptions = []
            }
        },
        goBackToFatherLayer(){
            this.switchFatherLayer(true)
            this.$data.searchQuery = ''
        },
        switchFatherLayer(status: boolean){
            this.$data.isFatherLayerOpen = status
        },
        async emitUserSelectedFatherOption(option:any){
            try{
                this.$data.selectedFatherOption = option.label

                if(!this.$data.doubleLayerModeOptions[option.label]){
                    this.$data.isChildrenOptionFetching = true
                    const response = await this.$props.childrenOptionFetchFunction(option.value, option.label)
                    this.$data.doubleLayerModeOptions[option.label] = response
                    this.generateNewDoubleLayerGroupModeOptions()
                    this.$data.isChildrenOptionFetching = false
                }
                
                this.switchFatherLayer(false)
            }catch(err){
                console.log(err)
            }
        },
        generateNewDoubleLayerGroupModeOptions(){
            const allOptions = Object.entries(this.$data.doubleLayerModeOptions)

            const result = allOptions.map((target:any)=>{
                const fatherLayerLabel = target[0]
                const value = target[1].reduce((acc:any, item:any)=>{
                    const group = ( acc[`${item.groupName ? item.groupName : 'Not Set'}`] || [] )
                    group.push(item)
                    acc[`${item.groupName ? item.groupName : 'Not Set'}`] = group	
                    return acc
                }, {
                })
                return {
                    fatherLayerLabel,
                    value
                }
            }).map((d:any)=>{
                let newObject = {
                    list: Object.keys(d.value),
                    data: Object.values(d.value),
                    type: d.fatherLayerLabel
                }
                return newObject
            })

            this.$data.doubleLayerGroupModeOptions = result
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

.chevron{
    &::before{
        border-style: solid;
        border-width: 0.25em 0.25em 0 0;
        content: '';
        display: inline-block;
        height: 0.45em;
        left: 0.15em;
        position: relative;
        top: 0.15em;
        transform: rotate(-45deg);
        vertical-align: top;
        width: 0.45em;
    }
    &.right:before {
        left: 0;
        transform: rotate(45deg);
    }

    &.bottom:before {
        top: 0;
        transform: rotate(135deg);
    }

    &.left:before {
        left: 0.25em;
        transform: rotate(-135deg);
    }
}

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
        &:hover:not([disabled]){
            border-color:#a7a6a6;
        }
        &:focus{
            outline: unset;
        }
        &:disabled{
            opacity: 0.5;
            filter: alpha(opacity=50);
            cursor: not-allowed;
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
        cursor:pointer;
    }

    .backToFatherLayerBtn__wrapper{
        position:relative;

        .backToFatherLayerBtn{
            margin-right: 2px;
            padding: 4px 16px 4px 14px;
            height:30px;
            span{
                position: absolute;
                top: 50%;
                left: 44%;
                transform: translate(-50%,-50%);
            }
        }
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

    .dropdown__searchField--doubleLayer{
        display: flex;
        flex-wrap: nowrap;
        align-items: center;
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

    .dropdown__linkBtn{
        display: block;
        margin: 6px;
        padding: 6px 12px;
        background-color: #ccc;
        text-align: center;
        border-radius: 5px;
        color: #000;
        font-weight: 600;
        text-decoration: none;
        cursor: pointer;
    }
}
</style>