/*
Parses grids json object and converts expression syntax into javascript functions. 

    All Lookup objects must have id field.

    grids: [
    {
        rowSelectStyle: xx

        navHeaderParams: {
            name: 'x'
            links: [{'name': xxx, 'url': xxx }],
            help: "",
            addRow:   false,
            newSheet: false,
            save: false,
            showFilter: false,
            showSort:   false,
            showSearchBar: false //not implemented yet
        }
        'queryParams': //i.e. new row, update, delete, etc read/etc create default objects for query params? handled by query parser
        { 
                default: ->
                select:  ->
                insert:  -> //string or {'route': 'string', 'doInstead': 'update', 'crudParams': {}}
                update:  ->
                delete:  ->
                upsert_set: [] //for upsert only sent in set object in payload
                set_filter: [] //for update will just filter things out from data object
                default_fields: {}
                on_constraint: ''
                on_conflict: ''
        }

        'columnDefs':
        {
            //agrid info
            'headerName': xyz
            'field': 'y'
            'chmodParams': //i.e. new row, update, delete, etc read/etc
            validator: function()
            alias: {'pull': 'push'} //defaults to field
            //not implemented yet also need try catch console log error.
            requiredFields: []
            validatorRequiredFields: [] //must all be not null or will not run. returns null in that case
            valueGetterRequiredFields: [] //must all be not null or will not run. returns null in that case
            requiredFieldsTypeCheck: true //unchangeage
            isRequired: true/false
            ignoreError: true/false (for calculated fields?) allow to pass or skip?
            typeCheckError? if true dont remove invalid data type.
                //show as error instead?. dont run validation if error. not implemented yet would
                //also have to add for xyz


            nullReplace: true
            editable: true/false {'update': true/false, 'insert': true/false}
            deleteWarning: string (determines if delete should happen) crudColumn assembles into overal string
            isFlag: for submit buttons or other functionality not meant to be sent to server.
                data is editable but doesnt get sent to the server. flags do allow the 
                row to be registered as a change.
            dataType:  //used for sorting? need to add time and datetime filters

            ifNull: 'psql string calls to replace value'
                'default', 'current_timestamp', 'current_time','null',
                'current_date', 'localtime', 'localtimestamp', ""

            //need to add parameters to defaultValue and defaultFilter to deal with sub modal cases
            //field determines which data to get from params.data in aggrid. key is if its an object.
            //use default value if null handle raw value or replacement from row params?
            defaultValue: {'value': 'string', 'type': '', 'key': '', 'field': '', ifNullSet: bool }
            defaultOrderby: 'asc/desc' (done by column order in columnDefs)
            defaultFilter: {  }

            showFilter: default true (if false cant be changed) should hide from filter module
            showSort: default true (if false cant be used for sorting)

            valueGetter: expression string or object
            valueSetter: expression string or object
            valueFormatter: expression string or object
            toolTip: expression string or object
            hide - hides the field
            suppressToolPanel - removes it from the tool panel.
            primaryKey: 'default id not implemented'

            crudColumn: {
                addButton: adds plus button to row. set values that should be copied
                    check if insert tracks position or need to use Array.indexOf(searchElement, fromIndex)
                    determine when button should be present. Also what fields should be copied. and what
                    the crudType should be
                removeButton: adds remove maybe cancel icon to crudColumn. For rows that
                    dont have a delete option.

                rowHeights: sent as meta_column.row_height in query. not a main parameter 

            }
        }
    }
    ]


*/
const DefaultParameters   = require('./ColumnDefs/DefaultParameters')
const ValueParser  = require('./ColumnDefs/ValueParser')
const CellClassRulesInit   = require('./ColumnDefs/CellClassRules')
const CustomCellParams     = require('./ColumnDefs/CustomCellParams')
const UiQueryFuncParams   = require('./UIQueryFuncParams')
const CrudMetaColumn   = require('./ColumnDefs/CustomCellParams/CrudColumn')

const ChmodParams = require('./ChmodParams')

const lodashCloneDeep = require('lodash.clonedeep')

//has whole grid object. Any data loading comes from
//grid_funcs. Vue Components can also have async await
class ColumnDefsInit {
    //for main loader
    //grid is json object for aggrid
    constructor(gridColumnDefs, valuesObject) {
        this.gridColumnDefs  = gridColumnDefs
        this.valuesObject    = valuesObject
    }

    RunSubGridColumnsInit(rowData, rowParams) {
        /*
            Same as main but adds rowData as parameters
            Order of function calls is important do not change. Initializes columnDefs
            for sub grid
        */
        let grid = lodashCloneDeep(this.gridColumnDefs)
        let x = new DefaultParameters(grid)
        let rowDataDefaults = rowParams['defaultValues'] || {}
        SubGridDefaultParamsInit(rowData, rowDataDefaults)

        for(let i=0; i < grid.length; i++) {
            let grid_column = grid[i]
            let field       = grid_column['field']
            let tmp = null
            tmp = new ChmodParams(grid_column)
            tmp.ChmodParamsInit()
    

            tmp = new ValueParser(grid_column, {}) //{} is for depricated globals object
            tmp.ValueParserInit()
            let gridColumnValuesObject = this.valuesObject[field] || []
            tmp = new CustomCellParams(grid_column, gridColumnValuesObject)
            tmp.CustomCellParamsInit()
            CellClassRulesInit(grid_column)
        }
        let tmp = new UiQueryFuncParams(grid)
        let rowFilterDefaults = rowParams['defaultFilters'] || {}
        let query_params = tmp.SubGridQueryParamsInit(rowData, rowFilterDefaults )

        //adds metacolumn and creates auxilary functions
        tmp = new CrudMetaColumn()
        let gridFunctions = tmp.MetaColumnInit(grid)
        return {'columnDefs': grid, 'gridFunctions': gridFunctions, 'queryParams': query_params}
    }

    RunGridColumnsInit() {
        /*
            Order of function calls is important do not change. Initializes columnDefs
            for main grid
        */
        //messes up column order probably. may need to preempty add column order
        let grid = lodashCloneDeep(this.gridColumnDefs)
        let x = new DefaultParameters(grid)
        x.DefaultParamsInit()

        for(let i=0; i < grid.length; i++) {
            let grid_column = grid[i]
            let field       = grid_column['field']
            let tmp = null
            tmp = new ChmodParams(grid_column)
            tmp.ChmodParamsInit()
            tmp = new ValueParser(grid_column, {}) //{} is for depricated globals object
            tmp.ValueParserInit()
            let gridColumnValuesObject = this.valuesObject[field] || []
            tmp = new CustomCellParams(grid_column, gridColumnValuesObject)
            tmp.CustomCellParamsInit()
            CellClassRulesInit(grid_column)
        }
        let tmp = new UiQueryFuncParams(grid)
        let query_params = tmp.QueryParamsInit()

        //adds metacolumn and creates auxilary functions
        tmp = new CrudMetaColumn()
        let gridFunctions = tmp.MetaColumnInit(grid)
        return {'columnDefs': grid, 'gridFunctions': gridFunctions, 'queryParams': query_params}
    }
}

module.exports = ColumnDefsInit