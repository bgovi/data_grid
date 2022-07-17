/*
1.) agRichSelectCellEditor
valuesObject gets passed into initializer. Each object in the valuesObject should match with fields in the
main query lookup inorder to work properly


cellEditor: 'agRichSelectCellEditor',
cellEditorPopup: true,
isLookup: true, //values has maps that converts to lookup or flat value
cellEditorParams: {
    values: ['Male', 'Female'] 
    allowNull: prepends null value to beginning of values array if string used
        as name of field
    pushKey: =  //defaults to field
    pullKey: =  //defaults to id //pullAndDisplay same key
    displayKey: //defaults to id (this goes into values)
    mapObjectLookupFields: defaults to all in object. otherwise fitler
    api: url_string
    mapObject: {key: value} takes select value and returns other value for crud
        mapObject[rowData['field] ] = {pushKey: pull_id}
        or 
        mapObject[rowData['field] ] = {field1: val1, field2: val2}
   },
},

*/

const type_check = require('../../../TypeCheck')
const auxFuncs = require('./auxilary_funcs')
const PushPullInit = auxFuncs['PullPushDisplayKeys']
const CellEditorParamsCheck = auxFuncs['CellEditorParamsCheck']

const data_config      = require('../../../DataConfig')
const meta_column_name = data_config['meta_column_name']



class AgRichParams {
    constructor(grid_column, valuesObject) {
        this.grid_column  = grid_column
        this.valuesObject = valuesObject
    }

    AgRichSelectParamsInit() {
        /*
            This creates the values and mapObject for the dropdown. MapObject only required
            for lookup. Otherwise return flat value. No ValueGetter or ValueSetter Required
        */
        let grid_column  = this.grid_column
        PushPullInit(grid_column)

        grid_column['cellEditorPopup'] = true
        let isLookup = grid_column['isLookup'] || false

        if (isLookup ) {
            let cep = grid_column['cellEditorParams']
            this.ValuesAndMapObject()
            grid_column['isLookup'] = true
            this.ValueGetter( grid_column, cep['mapObject']  )
            this.ValueSetter( grid_column, cep['mapObject']  )


        } else {
            this.ValuesDropDown()
            grid_column['isLookup'] = false
        }
        grid_column['isLookup'] = isLookup
    }

    ValuesDropDown() {
        /*
            values parameter will be an array for selector. Sets and gets value directly from values array.

            Parses jsonArray or array from valuesObject into values array.
        */
        let values = []
        let valuesObject = this.valuesObject
        let displayKey = this.grid_column['cellEditorParams']['displayKey']

        if (type_check.IsJsonArray(valuesObject) ) {
            if (this.grid_column['cellEditorParams']['allowNull'] || false ) { values.push(null) }
            for(let i=0; i<valuesObject.length; i++) {
                let x = valuesObject[i]
                let dk = x[displayKey]
                values.push(dk)
            }
        } else if ( type_check.IsArray(valuesObject) ) {
            if (this.grid_column['cellEditorParams']['allowNull'] || false ) { values.push(null) }
            for(let i=0; i<valuesObject.length; i++) {
                let x = valuesObject[i]
                let dk = x[displayKey]
                values.push(dk)
            }
        }
        let cep = this.grid_column['cellEditorParams']
        cep['values']    =  values
        cep['mapObject'] =  {}

    }

    ValuesAndMapObject() {
        /*
        Parses values object and returns values for drop down and the map object.
        The map object 


        values parameter will be an array for selector. Sets and gets value directly from values array.

        Parses jsonArray or array from valuesObject into values array.

        The return value must be an object for lookups or null.
        */
        let valuesObject = this.valuesObject
        let values = []
        let mapObject = {}
        let displayKey = this.grid_column['cellEditorParams']['displayKey']
        let pushKey = this.grid_column['cellEditorParams']['pushKey']
        let pullKey = this.grid_column['cellEditorParams']['pullKey']

        if (this.grid_column['cellEditorParams']['allowNull'] || false ) {
            values.push(null)
            mapObject[null] = null
        }

        for(let i=0; i<valuesObject.length; i++) {
            let x = valuesObject[i]
            let dk = x[displayKey]
            mapObject[dk] = this.MapObjectFields(x) //y {'id: 1} -> {'user_id': 1}
            values.push(dk)
        }
        let cep = this.grid_column['cellEditorParams']
        cep['values']    =  values
        cep['mapObject'] =  mapObject
    }
    MapObjectFields( values_row ) {
        /*
            Filters and adds rows to match main query structure.
            may add later. stringifies values
        */
        let svalues = {}
        let keys = Object.keys(values_row) 
        for (let i = 0; i < keys.length; i++) {
            let field = keys[i]
            svalues[field] = String(values_row[field])
        }
        return svalues
    }


    ValueSetter( grid_column, mapObject  ) {
        /*
            Returns null or obejct for richselector when set as a 
            lookup
        */
        if (grid_column.hasOwnProperty('valueSetter')) {return}
        const field = grid_column['field']
        let fn = function (params) {
            let val = params.data[field]
            if (val === null ) { return null}
            else if ( type_check.IsUndefined(params.data[field]) ) {
                console.error(`undefined`)
                return null
            }

            let backupVal = params[meta_column_name]['backup'][field]
            if (val === backupVal) {return val}
            else if (mapObject.hasOwnProperty(val) ) {
                return mapObject(val) //mapObject should have 
            }
            return null
        }
        grid_column['valueSetter'] = fn
    }

    ValueGetter(grid_column) {
        /*
            Returns null or displayValue of object for richselector when set as a 
            lookup
        */

        //data is object for autocomplete
        if (grid_column.hasOwnProperty('valueGetter')) {return}
        let field = grid_column['field']
        let displayKey = grid_column['displayKey'] 

        let fn = function (params) {
            if (type_check.IsNull(params.data[field]) ) {return null}
            else if ( type_check.IsUndefined(params.data[field]) ) {
                console.error(`undefined`)
                return null
            }
            return params.data[field][displayKey] || null
        }
        grid_column['valueGetter'] = fn
    }
    CheckRequiredFields( valuesObject) {
        let displayKey = this.grid_column['cellEditorParams']['displayKey']
        let pushKey = this.grid_column['cellEditorParams']['pushKey']
        let pullKey = this.grid_column['cellEditorParams']['pullKey']
        //if not error




    }
}

module.exports = AgRichParams