/*
Process the crudParams object

added rows default to insert
pulled rows default to update
delete button defaults to delete

may need to change default behavior

        'crud_params': //i.e. new row, update, delete, etc read/etc create default objects for query params?
            { 
                default: ->
                select:  ->
                insert:  -> //string or {'route': 'string', 'doInstead': 'update', 'crudParams': {}}
                update:  ->
                delete:  ->
                set_fields: [] //for upsert only
                set_filters: [] //for update will just filter things out from data object
                default_fields: {}
                on_constraint:
                on_conflict:
            }

//doInstead alias for changing crudType

insertParams : {
    'crudType': 'insert', 'route': 'string', 'on_constraint': "", 'on_conflict': "", 'set_fields': []
}
updateParams: {
    'crudType': 'update', 'route': 'string', 'on_constraint': "", 'on_conflict': "", 'set_fields': [] //used to filter out data
}

deleteParams: {
    'crudType': 'delete', 'route': 'string'
}

if null no crud allowed
*/

const type_check = require('../../../TypeCheck')

class CrudHeaderParams {
    constructor (crudParams, headerParams) {
        this.crudParams    = crudParams
        this.headerParams  = headerParams
        this.defaultRoute  = ""
    }
    DefaultRoutes() {
        this.defaultRoute = this.crudParams['default'] || ""
    }

    SelectParams()  {
        if (! this.crudParams.hasOwnProperty('select') ) {
            this.crudParams['select'] = {'route':this.DefaultRoute('insert') }
        }
    }
    InsertParams()  {
        //if string or only route
        if (! this.crudParams.hasOwnProperty('insert') ) {
            this.crudParams['insert'] = {
                'route': this.DefaultRoute('insert'),
                'crudType': 'insert',
                'on_constraint': this.crudPrams['on_constraint'] || "",
                'on_conflict':   this.crudPrams['on_conflict'] || "",
                'set_fields':    this.crudPrams['set_fields'] || [],
                'default_fields': this.crudPrams['default_fields'] || {}
            }
        }
        this.AddDefaultRouteAndType('insert')
        this.AddDefaultPrams('insert')
    }
    DeleteParams()  {
        if (! this.crudParams.hasOwnProperty('delete') ) {
            this.crudParams['delete'] = {
                'route': this.DefaultRoute('delete'),
                'crudType': 'delete',
                'on_constraint': "",
                'on_conflict':   "",
                'set_fields':    [],
                'default_fields':{}
            }
        }
        //delete warning
        this.AddDefaultRouteAndType('delete')
        this.AddDefaultPrams('delete')
    }
    UpdateParams()  {
        if (! this.crudParams.hasOwnProperty('update') ) {
            this.crudParams['update'] = {
                'route': this.DefaultRoute('update'),
                'crudType': 'update',
                'on_constraint': "",
                'on_conflict':   "",
                'set_fields':    [],
                'default_fields':{}
            }
        }
        this.AddDefaultRouteAndType('update')
        this.AddDefaultPrams('update')

    }
    HeaderParams() {
        /*
        Sets header params

        */
        let headerParams  = this.headerParams
        headerParams['newSheet'] = false
        headerParams['addRow']   = true
        headerParams['save']   = true

        let is_read_only = headerParams['isReadOnly'] || false
        if (is_read_only) {
            headerParams['newSheet'] = false
            headerParams['addRow']   = false
            headerParams['save']   = false
        }
        if (type_check.IsNull(this.crudParams['insert'])) { 
            headerParams['addRow']   = false
            headerParams['newSheet'] = false
        }
        if (type_check.IsNull(this.crudParams['insert']) && type_check.IsNull(this.crudParams['update'])
            && type_check.IsNull(this.crudParams['delete'])) { headerParams['save']   = false }

    }
    EnforcedFitlers(enforcedFilters) {
        //enforced filters are added to each query
        //if has enforcedFilters by default extend
        if (typeCheck.IsArray(this.crudParams['select']['enforcedFilters'] ) ) {
            let ef = this.crudParams['select']['enforcedFilters']
            for(let i =0; i< enforcedFilters.length; i++) {
                ef.push(enforcedFilters[i])
            }
        } else {
            this.crudParams['select']['enforcedFilters'] = enforcedFilters
        }
    }
    DefaultRoute(crudType) {
        //crudType is insert update or delete
        let base_str = this.defaultRoute
        return PathJoin(base_str, crudType)
    }
    AddDefaultRouteAndType(crud_type) {
        //adds default route or crudType if missing in object
        if (type_check.IsNull(this.crudParams[crudType])) {return}
        let crudObject = this.crudParams['delete']
        crudObject['crudType'] = crudObject['crudType'] || crud_type
        let cx = crudObject['crudType']
        crudObject['route']    = crudObject['route'] || this.DefaultRoute(cx)
    }
    AddDefaultPrams(crud_type) {
        let crudObject = this.crudParams[crudType]
        if (! crudObject.hasOwnProperty('on_constraint'))    {crudObject['on_constraint'] = ""}
        if (! crudObject.hasOwnProperty('on_conflict'))      {crudObject['on_conflict'] = ""}
        if (! crudObject.hasOwnProperty('set_fields'))       {crudObject['set_fields'] = [] }
        if (! crudObject.hasOwnProperty('default_fields'))   {crudObject['default_fields'] = {} }
        if (! crudObject.hasOwnProperty('setFilter'))      {crudObject['setFilter'] = []}
        if (! crudObject.hasOwnProperty('deleteWarning'))    {crudObject['deleteWarning'] = ""}
    }
    //ContextWindow
}

function PathJoin(base, new_path) {
    let b_end     = base.charAt(base.length -1 )
    let new_1 =    new_path.charAt(0)
    if (b_end === '/') {
        if (new_1 === '/') {return base + new_path.substring(1)
        } else { return base  + new_path }
    } else {
        if (new_1 === '/') {return base + new_path
        } else { return base +'/' + new_path }
    }
}

module.exports = {'CrudHeaderParams': CrudHeaderParams }