# Vue-Multi-Select

以 Vue 2 和 TypeScript 為基底的簡易選擇器
A Vue-Multi-Select via Vue 2.0 & TypeScript

## Table of Contents
  * [Demo](#demo)
  * [Getting Started](#getting-started)
  * [Built With](#built-with)
  * [Author](#author)
  * [License](#license)

## Demo
![Alt text](/demo.gif)

## Getting Started
### Prerequisites 安裝環境建置

* [Node.js](https://nodejs.org/en/) - Node.js® is a JavaScript runtime built on Chrome's V8 JavaScript engine.
* [Vue 2.0](https://vuejs.org/) - The Progressive JavaScript Framework

### How to use 如何使用

1. Install via npm 使用 npm 來進行安裝
```javascript
    cd /"your-vue-project-root-folder"/
    npm install @andy922200/vue-multi-select
```
2. Usage in Vue 2 在 Vue 2 環境下使用
```javascript
    /*  main.ts or main.js */
    import '@andy922200/vue-multi-select/dist/vue-multi-select.css'
    import VueMultiSelect from '@andy922200/vue-multi-select'
    Vue.use(VueMultiSelect)
```
3. Use the component in *.vue 在 *.vue 中使用套件 
```html
<template>
    <vue-multi-select 
        selector-title="Test"
        :is-fetching="isFetching"
        :button-options="{
            close: { name: 'Close1', hide: false},
            apply: { name: 'Apply1', hide: false},
            selectAll: { name: 'SelectAll1', hide: false},
            clear: { name: 'Clear1', hide: false},
        }"
        :options="yourData"
        place-holder-text="placeHolderText"
        @getSelectedOptions="method for receiving data"
    />
</template>
```
### Props 傳入參數
| Name | Default Value | Type | Required | Describe |
| ---- | ------- | --------- | -------- | -------- |
| single | false | Boolean | false | single select |
| limit | Infinity| Number | false | limit numbers of user-selected options |
| isFetching | false | Boolean | false | built-in spinner |
| selectorTitle| "" | String | true | Trigger Dropdown Button Text  |
| placeHolderText | false | String | false | searchBar placeHolderText |
| buttonOptions | buttonOption Default | Object | false | 4 Buttons ( Close, Apply, SelectAll Clear) |
| options| [] | Array | false | Selector Options

```js
// buttonOption Interface
{
    "name": "string",
    "hide": boolean
}

// buttonOption Default
{
    close: { name: 'Close1', hide: false},
    apply: { name: 'Apply1', hide: false},
    selectAll: { name: 'SelectAll1', hide: false},
    clear: { name: 'Clear1', hide: false},
}
```

### Event 觸發事件
| Name | Type | Describe |
| ---- | --------- | -------- |
| getSelectedOptions | customObject [] [Array] | get user-selected options |

```json
// custom Object => The label key is essential for each object.
{
    "key1":"value1",
    "key2":"value2",
    "key3":"value3",
    "label": "label1",
    "key4":"value4"
}
```
### Customize your Button 客製化按鈕
```html
<vue-multi-select>
    <template #closeBtn="{closeMethod}">
        <button @click="closeMethod">
            Close
        </button>
    </template>
</<vue-multi-select>
```

### Slot 
| Name | Method |
| ---- | --------- |
| closeBtn | closeMethod |
| applyBtn |applyMethod|
| selectAllBtn |selectAllMethod|
| clearBtn |clearSelectedOptionsMethod|

## Built With
* [Node.js](https://nodejs.org/en/) - Node.js® is a JavaScript runtime built on Chrome's V8 JavaScript engine.
* [Vue 2.0](https://vuejs.org/) - The Progressive JavaScript Framework
* [Vue-Sfc-Rollup](https://www.npmjs.com/package/vue-sfc-rollup) - vue-sfc-rollup is a CLI templating utility that scaffolds a minimal setup for compiling a Vue Single File Component (SFC) - or library of multiple SFCs
* [TypeScript](https://www.typescriptlang.org/) - TypeScript extends JavaScript by adding types.

## Author
- [Andy Lien](https://github.com/andy922200)

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) for details.