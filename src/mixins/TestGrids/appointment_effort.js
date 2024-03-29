let test_grid = {
"grids": [
    {

        // {"id":"1","lcg_name":"Undefined","lcg_code":"9999","is_active":true,"created_at":"2022-08-15 17:45:19","updated_at":"2022-08-15 17:45:19","last_modified_userid":"1"}


        "navHeaderParams": {
            "links": [{'name':'providers_cc', 'url': '/provider_effort/appointments'}]
        },
        //table
        "columnDefs": [
            {"field": "last_name", "valueGetter": "lookup(appointment_id,  'last_name')",  "editable": false, "showSort": true, "showFilter": true, "defaultSort": "asc"},
            {"field": "first_name","valueGetter":"lookup(appointment_id,   'first_name')", "editable": false, "showSort": true, "showFilter": true, "defaultSort": "asc"},
            {"field": "appointment_id", "headerName": "EmployeeNumCompanyCostCenter", "editable": true, "showSort": true, 
            "showFilter": true, "isRequired": true, "cloneOnCopy": true,
            "cellEditor": 'autoCompleteEditor', "width": 300, 
                "cellEditorParams": {
                    "api_route": "data/provider_effort/appointments_byuser_lv",
                    "columnDefs": [
                        {"field":'id'}, {"field":'last_name'}, {"field": 'first_name'},{"field": 'org_name'},
                        {"field": 'org_code'}, {"field": 'employee_number'},{"field": 'npi'},{"field": 'appointment_code'}
                    ],
                    "displayKey": "appointment_code"
                }
            },
            {"field": "effective_date", "headerName": "EffectiveDate", "cellEditor": 'dateTimeEditor',
                "dataType": "date", "editable": true, "showSort": true, "showFilter": true, "defaultSort": "desc"},
            {"field": "cfte",  "cloneOnCopy": true, "dataType": "numeric","requiredFields": ['cfte'], "validator":"1 >= ifnull(cfte,0)  >= 0", 
                "editable": true,  "showFilter": true, "showSort": true},

            {"field": "veterans_affairs",  "cloneOnCopy": true, "dataType": "numeric","requiredFields": ['veterans_affairs'],
                "validator":"1 >= ifnull(veterans_affairs,0)  >= 0", 
                "editable": true,  "showFilter": true, "showSort": true},
    
            {"field": "contract",   "cloneOnCopy": true, "dataType": "numeric","requiredFields": ['contract'] ,
                "validator":"1 >= ifnull(contract,0)  >= 0", 
                "editable": true,  "showFilter": true, "showSort": true},

            {"field": "academic",  "cloneOnCopy": true, "dataType": "numeric","requiredFields": ['academic'] ,
                "validator":"1 >= ifnull(academic,0)  >= 0", 
                "editable": true,  "showFilter": true, "showSort": true},

            {"field": "administration",  "cloneOnCopy": true, "dataType": "numeric","requiredFields": ['administration'],
                "validator":"1 >= ifnull(administration,0)  >= 0", 
                "editable": true,  "showFilter": true, "showSort": true},

            {"field": "full_effort", "showFilter": true, "showSort": true,  "valueGetter": "ifnull(cfte,0) + ifnull(veterans_affairs,0) + ifnull(contract,0) + ifnull(academic,0) + ifnull(administration,0) " ,
                "validator": "1>= ifnull(cfte,0) + ifnull(veterans_affairs,0) + ifnull(contract,0) + ifnull(academic,0) + ifnull(administration,0)  >=0"},

            {"field": "cfte_full_time" , "cloneOnCopy": true, "editable":true,
                "validator": "ifnull(cfte_full_time,0)  >=0"},
            {"field": "time_unit_name", "chmodParams": 'r', "editable": false, "showSort": true, "showFilter": true, "cloneOnCopy": true },

            {"field": "cfte_time",   "valueGetter": "ifnull(cfte_full_time,40.0) * ( ifnull(cfte,0) )"},
            {"field": "company_name", "valueGetter":"lookup(appointment_id,   'company_name')", "editable": false, "showSort": true, "showFilter": true},
            {"field": "company_code", "valueGetter":"lookup(appointment_id,   'company_name')", "editable": false, "showSort": true, "showFilter": true},
            {"field": "lob_name", "valueGetter":"lookup(appointment_id,   'lob_name')", "editable": false, "showSort": true, "showFilter": true},                
            {"field": "lob_code", "valueGetter":"lookup(appointment_id,   'lob_code')", "editable": false, "showSort": true, "showFilter": true},
            {"field": "department_name", "valueGetter":"lookup(appointment_id,    'department_name')", "editable": false, "showSort": true, "showFilter": true},
            {"field": "department_code", "valueGetter":"lookup(appointment_id,    'department_code')", "editable": false, "showSort": true, "showFilter": true},
            {"field": "specialty_name", "valueGetter":"lookup(appointment_id,     'specialty_name')", "editable": false, "showSort": true, "showFilter": true},
            {"field": "specialty_code", "valueGetter":"lookup(appointment_id,     'specialty_code')", "editable": false, "showSort": true, "showFilter": true},
            {"field": "cost_center_name", "valueGetter":"lookup(appointment_id,   'cost_center_name')", "editable": false, "showSort": true, "showFilter": true},
            {"field": "cost_center_code", "valueGetter":"lookup(appointment_id,   'cost_center_code')", "editable": false, "showSort": true, "showFilter": true},
            {"field": "npi", "valueGetter":"lookup(appointment_id,   'npi')", "editable": false, "showSort": true, "showFilter": true},
            {"field": "employee_number", "valueGetter":"lookup(appointment_id,   'employee_number')", "editable": false, "showSort": true, "showFilter": true},
            {"field": "id", "chmodParams": 'rw', "editable": false, "showSort": true, "showFilter": true },
            {"field": "is_active",   "dataType": "boolean", "editable": false, "showSort": true, "showFilter": true,
                "defaultSort": "desc", "chmodParams": 'r', "defaultFilter": "true"},
            {"field": "last_modified_by_user_email", "chmodParams": 'r', "editable": false, "showSort": true, "showFilter": true },
            {"field": "updated_at", "chmodParams": 'r', "editable": false, "showSort": true, "showFilter": true }
        ],
        "routeParams": {
            "default_route":   "data/provider_effort/appointment_effort_byuser_uv", //,
            'select': {'route':"data/provider_effort/appointment_effort_byuser_rv/select"}
        }
    }
]}

/*
Middle wear hooks

send json to -> http://xxx before select/insert/update/delete
send json to -> http://xxx after select/insert/update/delete

valdiations

x > 1 required before insert
validation queries
multi server joins


*/


module.exports = test_grid