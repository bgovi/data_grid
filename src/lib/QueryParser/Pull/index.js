/*
This module is responsible for creating and maintaining the parameters required for 
pulling data into the main grid.

Filters
OrderBy
Pagination
Get Route parameter assembly.

The async request is made in another module


UI object for filter. value2 is for between and not_between
{'column_name': 'col_name_3', 'operator': '!=', 'value':  'a', 'value2': null, delimiterType: null, dataType: null },

let query_params = [
    Array of objects. Contains information for crud operations.
    Operation order is not preserved.
    {
        "crud_type": "", //only needed for save route 
        "data": "", //array of objects: [{x:"valx1", y:"valy1"},{x:"valx2", y:"valy2"}]
        "default_fields": "", //object with default type {x:"default_value_x", y:"default_value_y"}
        "set_fields": "",  //array that has columns that should be used for set on upsert
        "on_conflict": "", //string a-zA-Z0-9
        "on_constraint": "", //string a-zA-Z0-9
        "where": "", //array of objects: [{x:"valx1", y:"valy1"},{x:"valx2", y:"valy2"}]
        "offset": "", //should be integer greater or equal to 0
        "limit": "", //should be positive integer
        "search_filter": "", //string or object with quick filter type:
        "search_rank": "", //bool
        "returning": "", //array of fields to used for returning [id, column_1, xxx] //defaults to id?
        "order_by": ""  // [{'col1': 'asc}, {'col_2': 'desc'}] 
        }
    ]


//value2 used for between and not_between
//otherwise eveything stored in value

let order_by = { 'column_name': xyz, 'order_by': 'asc }

let where_statements = [
    {'column_name': 'col_name_1', 'operator': '=', 'value':  1 },
    {'column_name': 'col_name_2', 'operator': 'is_null', 'value':  "" },
    {'column_name': 'col_name_3', 'operator': '!=', 'value':  'a' },
]

*/


const data_config = require ('../../../DataConfig')
const type_check = require('../../../TypeCheck')


function NewQuerySet(filterParams, orderByParams, pageParams ) {
    //resets query params.
    ftmp = filterParams['new']
    otmp = orderByParams['new']
    filterParams['current'] = ftmp
    filterParams['new'] = []
    orderByParams['current'] = otmp
    orderByParams['new'] = []
    newPage = PageInit()
    let keys = Object.keys(newPage)
    for(let i = 0; i < keys.length; i++) {pageParams[keys[i]] =newPage[keys[i]] }
}


//pagination functions
function ChangePage(i, page_params) {
    let page_index = page_params['page_index']
    if(type_check.IsInteger(i) ) {
        page_index = page_index + parseInt(i)
    } else {page_index = 0 }

    if (page_index < 0) { page_index = 0 }
    let page_size = page_params['page_size']
    page_params['limit']  = (1+page_index)*page_size
    page_params['offset'] = page_index*page_size
}

//create parameters for query
function CreateNewQueryParams(filterParams, orderByParams, pageParams ) {
    NewQuerySet(filterParams, orderByParams, pageParams )
    let urlParams = GetRouteParams(filterParams['current'], orderByParams['current'], pageParams )
    return urlParams
}

function CreatePreviousPageParams(filterParams, orderByParams, pageParams) {  
    ChangePage(-1, pageParams )
    let urlParams = GetRouteParams(filterParams['current'], orderByParams['current'], pageParams )
    return urlParams
}
function CreateNextPageParams(filterParams, orderByParams, pageParams) { 
    ChangePage(1, pageParams ) 
    let urlParams = GetRouteParams(filterParams['current'], orderByParams['current'], pageParams )
    return urlParams
}

function IsLookup(column_name, lookupColumns) {
    if (lookupColumns.hasOwnProperty(column_name)) {return true}
    return false
}

function DefaultFilterInit(column_name, header_name, data_type) {
    let def_operator = data_config.DefaultOperator(data_type_name)
    let init_filter = {'column_name': column_name, 'operator': def_operator, 'value':  null, 
        'value2': null, 'delimiterType': null, 'dataType': data_type,
        'headerName': header_name }
    return init_filter
}

function ClearFilterValue( filterObjectRow ) {
    filterObjectRow['value']  = null
    filterObjectRow['value2'] = null
}

function DefaultOrderByInit(column_name, header_name) {
    let init_order = {'column_name': column_name, 'order_by': 'asc', 'headerName': header_name}
    return init_order
}


function RemoveFilter(  filter_array, index )  { RemoveItemFromArray( filter_array, index) }
function RemoveOrderBy( orderby_array, index ) { RemoveItemFromArray( orderby_array, index)}

function RemoveItemFromArray( array, index ) {
    if (index > -1) { array.splice(index, 1) }
}

function ClearFilters(filter_array)  { filter_array.length = 0 }
function ClearOrderBy(orderby_array) { orderby_array.length = 0 }

function ClearFilterValues(filterRow) { 
    filterRow['value'] = null
    filterRow['value2'] = null
}

function DelimiterType (delimiter_type) {
    //{ '/\s+/':'Any Space'}
    let defaultDelimiter = data_config.defaultDelimiter
    if (data_type.delimiter_typeName.hasOwnProperty(delimiter_type)) {
        return delimiter_type
    }
    return defaultDelimiter
} 
//how to split and return value

//add meta_column in gridFunctions
function ServerRowToUiRow(queryRowData, IsLookup, IsCrud) {
    //parses queryRowData into rowData for grid.

    let rowData = {}
    let keys = Object.keys(queryRowData)
    for(let i =0; i < keys.length; i++ ) {
        let field = keys[i]
        let isCrud = IsCrud[field] || false
        if (! isCrud ) {continue}
        if (isCrud === 'w') {continue}
        //If IsLookup
        if (! IsLookup.hasOwnProperty(field) ) {
            let val = LookupParse(column_name, queryRowData)
            rowData[field] = val
        } else { rowData[field] = queryRowData[keys[i].trim()] }
    }
    return rowData
}

function ColumnLookupFields(serverRowData) {
    /*
    Converts xyz to xyz. .operator is special
    if field has . assumes base string is field and lookup field is after


    */
    let fields = Object.keys(serverRowData)
    let lookups = {}
    let rowData = {}
    for(let i =0; i< fields.length; i++ ) {
        let fx = fields[i]
        if (fx.includes('.')) {
            let fk = fx.split(".")[0]
            lookups[fk] = {}
        }
        rowData[fx] = serverRowData[fx]
    }
    for(let i =0; i < fields.length; i++ ) {
        if (fx.includes('.')) {
            let fk = fx.split(".")[0]
            let lk = fx.split(".")[1]
            lookups[fk][lk] = rowData[fk]
        } else if (lookups.hasOwnProperty(fx) ) {
            lookups[fx][fx] = rowData[fx]
        }
    }
    for(let i =0; i < fields.length; i++ ) {
        if (fx.includes('.')) {
            let fk = fx.split(".")[0]
            let lk = fx.split(".")[1]
            lookups[fk][lk] = rowData[fk]
        } else if (lookups.hasOwnProperty(fx) ) {
            lookups[fx][fx] = rowData[fx]
        }
    }
    let lks = Object.keys(lookups)
    for(let i =0; i< lks.length; i++) { rowData[lks[i]] = lookups[lks[i]] }
    return rowData
}



//add functionality for aliases later
//error if is string. means no match found
function LookupParse(column_name, queryRowData) {
    let column_value = {}
    let keys = Object.keys(queryRowData)
    let cn_dot = column_name+'.'
    for(let i =0; i < keys.length; i++ ) {
        let value = queryRowData[keys[i]]
        let key = keys[i]
        if (key.startsWith(cn_dot) ) {
            let k2 = key.split('.')
            if (k2.length < 2) {continue}
            column_value[k2[1].trim() ] = value
        }
    }
    return column_value
}


//crud_fields
//ignore primary_key


function GetRouteParams(filterParams, orderByParams, pageParams ) {
    /*
    Pulls data rules and intializes paramters. queryParams is an object that contains the current values
    from all the modal windows.
    req_body from client has the following structure
    req.body['where'] = [{}]
    req.body['order_by'] = [{}]
    req.body['pagination'] = {}
    */
    let req_body = {}
    req_body['where']      = WhereObject(filterParams)
    req_body['order_by']   = OrderByObject(orderByParams)
    req_body['pagination'] = PaginationObject(pageParams)
    return req_body
}


function PaginationObject(pagination) {
    var lx = parseInt(pagination['limit'])
    var offset = parseInt(pagination['offset'])
    if (isNaN(lx) ) {lx = data_config.page_size}
    if (lx < 0) {lx = data_config.page_size}
    if (isNaN(offset) ) {offset = 0}
    if (offset < 0 ) {offset = 0}
    var pgx = {}
    pgx['limit']  = String(lx)
    pgx['offset'] = String(offset)
    return pgx
}

function OrderByObject(order_by) {
    //if column name is empty or sort_by is empty continue
    let order_by_list = []
    for (let i =0; i < order_by.length; i++) {
        let ox = order_by[i]
        let cn = ox['column_name']
        let sb = ox['order_by'].toLowerCase()
        if (['ASC', 'DESC'].includes(sb) && cn !== "" ) {
            order_by_list.push({'column_name': cn, 'order_by': sb})
        }
    }
    return order_by_list
}


//Functions below used for processing filter object.
function WhereObject(filter_list) {
    /*
    where_list: contains the where statemenents generated by the modal windows where, order_by and pagination
    where_list_out: container object for req_body. contains processed where statements to send to the server
    */
    let fout = []
    for(var i =0; i< filter_list.length; i++) {
        AppendFilterRow(fout, filter_list)
    }
    return fout
}

function AppendFilterRow(fout, filterRow) {
    let fr = {}
    let operator = filterRow['operator']
    let value = null
    if (data_config.array_parse_types.includes(operator)) {
        let values = ArrayValueParse(filterRow)
        if (values.length === 0) { return }
        value = values
    }

    else if (data_config.between_parse_types.includes(operator)) {
        let values = BetweenValueParse(filterRow)
        if (values.length != 2) { return }
        value = values
    }

    else if (data_config.null_parse_types.includes(operator)) { value = ""}
    else { 
        //if null?
        value = String(filterRow['value']).trim() 
    }
    fr['column_name'] = filterRow['column_name']
    fr['operator'] = operator
    fr['value'] = value
    fout.push(fr)
}

//log warnings?
function ArrayValueParse(filterRow) {
    let value = filterRow['value']
    let data_type = filterRow['dataType']
    let tcFunc = GetTypeCheckFunction(data_type)
    let delim  = DelimiterType (filterRow['delimiter'])
    let values = value.split(delim)
    let out_array = []
    for (let i = 0; i < values.length; i++) {
        if (tcFunc(values[i])) { out_array.push(String(values[i]).trim() ) }
    }
    return out_array
}

function BetweenValueParse(filterRow) {
    let val1 = filterRow['value']
    let val2 = filterRow['value2']
    let data_type = filterRow['dataType']
    let tcFunc = GetTypeCheckFunction(data_type)
    if (tcFunc(val1) && tcFunc(val2) ) { return [String(val1), String(val2)] }
    return []
}

// function TypeCheckFunction(data_type) {
function GetTypeCheckFunction(data_type) {
    let dc = data_config.ReturnDataClass(data_type)
    if (dc === 'number') { return type_check.IsNumber}
    else if (dt === 'date') {return type_check.IsDate} 
    else if (dt === 'string') { return type_check.IsString} 
    else if (dt === 'boolean') { return type_check.IsBoolean}
    else { return type_check.IsString }
}