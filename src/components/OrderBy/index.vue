<!--
This module stores the information needed to select the order at which rows will be returned from the server. 

The possible column fields are stored in the columnSortNames array. The user selected values are stored in the
order_by object. This information is parsed by get_route_params on RunQuery.


  [{'column_name': "a", "order_by": "" }]
-->
<template>
<div class="ml-5 mr-5">
  <div class='level'>
    <div class="levelLeft">
      <button class="button is-small is-light" @click="AddRow()">Add</button>
      <button class="button is-small ml-2 is-light" @click="DeleteRow()">Delete</button>
      <button class="button is-small ml-2 is-light" @click="ClearRows()">Clear</button>
    </div>

    <div class="levelRight">
      <button class="button is-small is-success" @click="Accept()">Accept</button>
      <button class="button is-small ml-2 is-danger" @click="Cancel()">Cancel</button>
    </div>


  </div>

  <div v-for="(n,index) in order_by" v-bind:key="index" >
        <p class="is-inline-block is-size-4 mr-2 mb-3" >{{SortLabel(index)}} </p>
        <div class="select" >
          <select class="is-inline-bloc" v-model="order_by[index].column_name" @change="LogChange">
              <option value="" disabled selected hidden>Select a Column</option>
              <option v-for="(valx, index2) in remaining_options(index)" :key="index2" :value="valx">{{ReturnHeaderName(valx)}}</option>
          </select>
        </div>
        <div class="select" >
          <select class="is-inline-block ml-2" v-model="order_by[index].order_by">
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
          </select>
        </div>
        <button class="delete ml-2 is-vcentered mt-2" type="button" @click="DeleteRowAtIndex(index)"></button>
  </div>
</div>
</template>
<script>

// {'headerName': headerName, 'column_name': field, 'order_by': 'asc' }
// @change="someHandler"

import type_check from '@/lib/TypeCheck'

export default {

  props: {
    orderByParams: {
      type: Object,
      default: {
        'new': [],
        'orderByList': []
      }
    }
  },

  data() {
    return {
      order_by: null,  
      // [
      //   {'column_name': "a", "order_by": "" },
      //   {'column_name': "b", "order_by": "" },
      //   {'column_name': "c", "order_by": "" },
      //   {'column_name': "d", "order_by": "" }
      // ],
      columnSortNames: [],
      
      // ['a','b','c','d','e','f','g','h','i',
      //   'j','k', 'l','m','n','o','p','q','r','s','t'], //,
      // 'b': b,
      // 'vx': vx,
      headerNameMap: {}
    }
  },  

  mounted() {
    this.order_by = this.orderByParams['new']
    if (this.order_by.length < 1) {
      this.order_by.push({'headerName': "",'column_name': "", "order_by": "asc" })
    }
    let orderByList = this.orderByParams['orderByList']

    for (let i=0; i< orderByList.length; i++) {
      let ox = orderByList[i]
      let column_name = ox['column_name']
      let header_name = ox['headerName']
      this.columnSortNames.push(column_name)
      this.headerNameMap[column_name] = header_name
    }
    this.SetDefaultSortOrder()
  },

  methods: {
    ReturnHeaderName(column_name) {
      if (type_check.IsNull(column_name) || type_check.IsUndefined(column_name ) ) {return ""}
      if (this.headerNameMap.hasOwnProperty(column_name)) {
        return this.headerNameMap[column_name]
      } else {
        return ""
      }
    },
    ChangeHeader(orderByRow) {
      orderByRow['headerName'] = this.ReturnHeaderName(orderByRow['column_name'])
    },

    remaining_options (index) {
      var tmp = []
      var current_value = this.order_by[index].column_name
      this.columnSortNames.forEach( (cv) => {
        var hit = false
        var i
        for (i=0; i <this.order_by.length; i++) {
          // console.log(ob)
          if (this.order_by[i].column_name === cv) {
            hit = true
            break
          }          
        }
        if (!hit) {tmp.push(cv)}
      })
      if (current_value !== "") { tmp.push(current_value)}

      return tmp
    },

    SetDefaultSortOrder() {
      for(var i =0; i < this.order_by.length; i++) {
        if (this.order_by[i].order_by.trim() === '') {
          this.order_by[i].order_by = 'asc'
        }
      }

    },


    SortLabel(i) {
      if (i==0) { return 'sort by:' }
      else {return 'then by:'}
    },

    AddRow() {
      if (this.order_by.length < this.columnSortNames.length) {
        this.order_by.push({'column_name': "", "order_by": "asc" })
      }
    },
    ClearRows() {
      while(this.order_by.length > 1) {
        this.order_by.pop()
      }
      this.order_by[0]['column_name'] = ""
      this.order_by[0]['order_by'] = "asc"
    },
    DeleteRowAtIndex(index) {
      if (this.order_by.length <= 1 ) {
        this.order_by[0]['column_name'] = ""
        this.order_by[0]['order_by'] = "asc" 
      }
      else if (index < 0 || index > this.order_by.length) {}
      else {
        this.order_by.splice(index, 1)
      }
    },
    DeleteRow() {
      if (this.order_by.length > 1) {
        this.order_by.pop()
      }
      else if (this.order_by.length === 1) {
        let x = this.order_by[0]
        x.column_name = ""
        x.order_by = "asc"
      }
    },
    Accept() { this.$emit('accept') },
    Cancel() { this.$emit('cancel') }

  }
}

</script>