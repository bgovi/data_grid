const cost_center = {
    "comments": "cost centers. last component of heirarchy. Main linking point",
    "grids": [
        {
            "navHeaderParams": {
                "links": [
                    {'name':'company',          'url': '/provider_effort/company'},
                    {'name':'lob',              'url': '/provider_effort/lob'},
                    {'name':'department',       'url': '/provider_effort/department'},
                    {'name':'specialty',        'url': '/provider_effort/specialty'},
                    {'name':'cost_center',      'url': '/provider_effort/cost_center'},
                    {'name':'cost_center_time', 'url': '/provider_effort/cost_center_time'}                
                
                ]
            },


            "columnDefs": [

                { "headerName": "CompanyName", "field": "lob_name", "valueGetter":"lookup(specialty_id,   'company_name')", "editable": false, "showSort": true, "showFilter": true, "defaultSort": "asc" },                
                { "headerName": "CompanyCode", "field": "lob_code", "valueGetter":"lookup(specialty_id,   'company_code')", "editable": false, "showSort": true, "showFilter": true },

                { "headerName": "LobName", "field": "lob_name", "valueGetter":"lookup(specialty_id,   'lob_name')", "editable": false, "showSort": true, "showFilter": true,  "defaultSort": "asc" },                
                { "headerName": "LobCode", "field": "lob_code", "valueGetter":"lookup(specialty_id,   'lob_code')", "editable": false, "showSort": true, "showFilter": true},
                { "headerName": "DepartmentName", "field": "department_name", "valueGetter":"lookup(specialty_id,    'department_name')", "editable": false, "showSort": true, "showFilter": true,  "defaultSort": "asc" },
                { "headerName": "DepartmentCode", "field": "department_code", "valueGetter":"lookup(specialty_id,    'department_code')", "editable": false, "showSort": true, "showFilter": true},
                { "headerName": "SpecialtyName", "field": "specialty_name", "valueGetter":"lookup(specialty_id,     'specialty_name')", "editable": false, "showSort": true, "showFilter": true,  "defaultSort": "asc" },
                { "headerName": "SpecialtyCode", "field": "specialty_code", "valueGetter":"lookup(specialty_id,     'specialty_code')", "editable": false, "showSort": true, "showFilter": true},

                { "headerName": "SpecialtyId",     "field": "specialty_id",  "editable": true, "showSort": true, 
                    "showFilter": true, "isRequired": true,
                    "cellEditor": "autoCompleteEditor",
                    "cellEditorParams": {
                        "api_route": "data/provider_effort/specialty_lv",
                        "columnDefs": [
                                {"field": "company_name"}, {"field": "company_code"},
                                {"field": "lob_name"},     {"field": "lob_code"},
                                {"field": "department_name"},     {"field": "department_code"},
                                {"field": "specialty_name"},      {"field": "specialty_code"},
                                {"field": "id"} 
                            ],
                        "displayKey": "lob_name"
                    }
                },
                { "field": "is_active",   "dataType": "boolean", "editable": true, "showSort": true, "showFilter": true,
                    "isRequired": true, "isLookup": true,  "defaultFilter": "true",
                    "cellEditor": "agRichSelectCellEditor", "cellEditorParams": {"valuesObject": [
                        {"is_active": "true", "id": "true"},
                        {"is_active": "false","id": "false"}
                    ],'pullKey': "is_active"}
                },

                { "headerName": "CostCenterName", "field": "cost_center_name", "editable": true, "showSort": true, "showFilter": true, "defaultSort": "asc" },
                { "headerName": "CostCenterCode","field": "cost_center_code",  "editable": true, "showSort": true, "showFilter": true},

                {"field": "last_modified_user_email", "chmodParams": "r", "editable": false, "showSort": true, "showFilter": true },
                {"field": "updated_at", "chmodParams": "r", "editable": false, "showSort": true, "showFilter": true },
                {"field": "id", "chmodParams": "rw", "editable": false, "showSort": true, "showFilter": true }
    
            ],
            "routeParams": {
                "default_route": "data/provider_effort/cost_center",
                "select": {"route":"data/provider_effort/cost_center_rv/select"}

            }
        }
    ]
}

module.exports = cost_center