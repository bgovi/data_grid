/*
Appends function to class rules if empty for each row

editable_pass_style
editable_error_style
non_editable_pass_style
non_editable_error_style

class styles are stored in ./assets/cell_survey.scss

need to add pass is null or true
*/

const type_check = require('../../../TypeCheck')




function CellClassRulesInit( grid_column) {
    /*
        Assembles cellClassRules based on if is_editable is a function or boolean and
        if validatorFunction is defined
    */

    let is_editable = grid_column['editable']
    let validator_function = grid_column['validator'] || null
    if (type_check.IsNull(validator_function) || type_check.IsUndefined(validator_function) ) {
        validator_function = function (params) {return true}
    }
    let IsEditableFunction = null
    if (type_check.IsBoolean(is_editable) ) {
        IsEditableFunction = function (params) {return is_editable}
    } else {
        //function
        IsEditableFunction = is_editable
    }



    // if (grid_column.hasOwnProperty('cellClassRules')) { return }

    let cellClassRules = {}
    cellClassRules['editable_pass_style']       = EditablePassStyle(IsEditableFunction, validator_function)
    cellClassRules['editable_error_style']      = EditableErrorStyle(IsEditableFunction, validator_function)
    cellClassRules['non_editable_pass_style']   = NonEditablePassStyle(IsEditableFunction, validator_function)
    cellClassRules['non_editable_error_style']  = NonEditableErrorStyle(IsEditableFunction, validator_function)

    let cellStyles = {
        "editable_pass_style": {
            "borderColor": '',
            "borderWidth": 'thin',
            "backgroundColor": ""
        },
    
        "editable_error_style":  {
            "borderColor": 'red',
            "borderWidth": 'thin', 
            "backgroundColor": ""
        },
    
        "non_editable_pass_style": {
            "borderColor": '',
            "borderWidth": 'thin', 
            "backgroundColor": "rgba(189, 195, 199, 0.3)"
        },
    
        "non_editable_error_style": {
            "borderColor": 'red',
            "borderWidth": 'thin', 
            "backgroundColor": "rgba(189, 195, 199, 0.3)"
        }
    
    }

    //quick hack to use cellStyle instead of cellClassRules. Rules was not working
    let cellStyleKeys = Object.keys(cellClassRules)
    const fs = function CellStyle( params ) {
        for (let i =0; i<cellStyleKeys.length; i++ ) {
            let cs = cellStyleKeys[i]
            let fn = cellClassRules[cs]
            // console.log(cellClassRules)
            // console.log(fn)
            if (fn(params)) {
                return cellStyles[cs]
            }
        }
        return null
    }

    grid_column['cellStyle'] = fs
    //return cellStyle
    // grid_column['cellClassRules'] = cellClassRules
}





function EditablePassStyle(is_editable, vf) {
    if (type_check.IsFunction(is_editable) ) {
        return function (params) { 
            return is_editable(params) && ValidatorPass(vf(params) ) }
    }
    else {
        return function (params) { return is_editable && ValidatorPass(vf(params) ) }
    }

}
function EditableErrorStyle(is_editable, vf) {
    if (type_check.IsFunction(is_editable) ) {
        return function (params) { return is_editable(params) && ! ValidatorPass(vf(params) ) }
    }
    else {
        return function (params) { return is_editable && ! ValidatorPass(vf(params) ) }
    }
}
function NonEditablePassStyle(is_editable, vf) {
    if (type_check.IsFunction(is_editable) ) {
        return function (params) { return !is_editable(params) && ValidatorPass(vf(params) ) }
    }
    else {
        return function (params) { return !is_editable && ValidatorPass(vf(params) ) }
    }
}
function NonEditableErrorStyle(is_editable, vf) {
    if (type_check.IsFunction(is_editable) ) {
        return function (params) {  return !is_editable(params) && ! ValidatorPass(vf(params) ) }
    }
    else {
        return function (params) {  return !is_editable && ! ValidatorPass(vf(params) ) }
    }
}

function ValidatorPass(val) {
    /*
    Returns true if validation function passes i.e. returns true
    or does not run returns null. Null should be returned if missing
    required fields to run.
    */
    if (val === true || val === null || typeof val === 'undefined') {return true}
    return false
} 


module.exports = CellClassRulesInit