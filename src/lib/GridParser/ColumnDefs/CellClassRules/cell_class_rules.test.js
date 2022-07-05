const cr = require('./index.js')

/*
check validation returns boolean or null
check null type casting still works. check if 
addition works with string alt value and number type alt value.

check lookups
check requiredFields
*/

// CellClassRulesInit( grid_column, is_editable, validator_function )

const classNames = ['editable_pass_style', 'editable_error_style',
    'non_editable_pass_style', 'non_editable_error_style'
]

//isvalid
let vtx = function (params) {return true}
let vfx = function (params) {return false}

//is editable
let etx = function (params) {return true}
let efx = function (params) {return false}

function gc() { return {'field': 'colA'} }

function CalcCr(grid_column) {
    let bool_list = []
    for (let i =0; i < classNames.length; i++) {
        if (! grid_column['cellClassRules'].hasOwnProperty(classNames[i]) ) {bool_list.push(false)}
        else{
            bool_list.push( grid_column['cellClassRules'][classNames[i]]({})  )
        }
    }
    return bool_list
}

test('is editable boolean without validation', () => {
    let grid_column = gc()
    cr.CellClassRulesInit(grid_column, true, null)
    let res = CalcCr(grid_column)
    expect(res).toMatchObject([true, false, false, false])

})

test('not editable boolean without validation', () => {
    let grid_column = gc()
    cr.CellClassRulesInit(grid_column, false, null)
    let res = CalcCr(grid_column)
    expect(res).toMatchObject([false, false, true, false])
})


test('is editable function without validation', () => {
    let grid_column = gc()
    cr.CellClassRulesInit(grid_column, etx, null)
    let res = CalcCr(grid_column)
    expect(res).toMatchObject([true, false, false, false])
})

test('not editable function without validation', () => {
    let grid_column = gc()
    cr.CellClassRulesInit(grid_column, efx, null)
    let res = CalcCr(grid_column)
    expect(res).toMatchObject([false, false, true, false])
})


// //with validaiton function
test('is editable boolean with validation true', () => {
    let grid_column = gc()
    cr.CellClassRulesInit(grid_column, true, vtx)
    let res = CalcCr(grid_column)
    expect(res).toMatchObject([true, false, false, false])
})

// //with validaiton function
test('is editable boolean with validation false', () => {
    let grid_column = gc()
    cr.CellClassRulesInit(grid_column, true, vfx)
    let res = CalcCr(grid_column)
    expect(res).toMatchObject([false, true, false, false])
})


test('not editable boolean with validation false', () => {
    let grid_column = gc()
    cr.CellClassRulesInit(grid_column, false, vfx)
    let res = CalcCr(grid_column)
    expect(res).toMatchObject([false, false, false, true])
})

test('not editable boolean with validation true', () => {
    let grid_column = gc()
    cr.CellClassRulesInit(grid_column, false, vtx)
    let res = CalcCr(grid_column)
    expect(res).toMatchObject([false, false, true, false])
})
