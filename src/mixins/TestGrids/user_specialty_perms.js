let user_org_permission = {
    "grids": [
        {
            "navHeaderParams": {
                "links": [{'name':'app_permissions', 'url': '/admin/user_app_perms'}]
            },
            "columnDefs": [

                {"field": "last_name", "valueGetter":"lookup(user_id,   'last_name')",  "editable": false, "showSort": true, "showFilter": true, "defaultSort": "asc"},
                {"field": "first_name","valueGetter":"lookup(user_id,   'first_name')", "editable": false, "showSort": true, "showFilter": true, "defaultSort": "asc"},
                {"field": "user_id", "headerName": "email", "editable": true, "showSort": true, 
                    "showFilter": true, "isRequired": true, "cloneOnCopy": true,
                    "cellEditor": 'autoCompleteEditor',
                    "cellEditorParams": {
                        "api_route": "data/app_admin/users_lv",
                        "columnDefs": [
                            {"field":'id'}, {"field":'last_name'}, {"field": 'first_name'},{"field": 'email'} ],
                        "displayKey": "email"
                    }
                },
                {"field": "cost_center_id", "headerName": "CompanyCostCenterCode", "editable": true, "showSort": true, 
                    "showFilter": true, "isRequired": true, "width": 230,
                    "cellEditor": 'autoCompleteEditor',
                    "cellEditorParams": {
                        "api_route": "data/provider_effort/cost_center_lv",
                        "columnDefs": [
                                {"field": 'company_name'}, {"field": 'cost_center_name'},
                                {"field": 'lob_name'}, {"field": 'lob_code'},
                                {"field": 'department_name'}, {"field": 'department_code'},
                                {"field": 'specialty_name'}, {"field":  'specialty_code'},
                                {"field": 'org_name'}, {"field": 'org_code'}, 
                                {"field": 'id'}, 
                            
                            ],
                        "displayKey": "org_code"
                    }
                },

                {"field": "is_active",   "dataType": "boolean", "editable": true, "showSort": true, "showFilter": true,
                    'isRequired': true, "isLookup": true,
                    'cellEditor': 'agRichSelectCellEditor', 'cellEditorParams': {'valuesObject': [
                        {'is_active': 'true', 'id': 'true'} 
                        ,{'is_active': 'false', 'id': 'false'}
                    ],'pullKey': "is_active"}
                },
                {"field": "specialty_level",   "dataType": "boolean", "editable": true, "showSort": true, "showFilter": true,
                    'isRequired': true, "isLookup": true,
                    'cellEditor': 'agRichSelectCellEditor', 'cellEditorParams': {'valuesObject': [
                         {'specialty_level': 'true', 'id': 'true'} 
                        ,{'specialty_level': 'false', 'id': 'false'}
                    
                    ],'pullKey': "specialty_level"}
                },
                {"field": "department_level",   "dataType": "boolean", "editable": true, "showSort": true, "showFilter": true,
                    'isRequired': true, "isLookup": true,
                    'cellEditor': 'agRichSelectCellEditor', 'cellEditorParams': {'valuesObject': [
                        {'department_level': 'true', 'id': 'true'} 
                        ,{'department_level': 'false', 'id': 'false'}
                    
                    ],'pullKey': "department_level"}
                },
                {"field": "lob_level",   "dataType": "boolean", "editable": true, "showSort": true, "showFilter": true,
                    'isRequired': true, "isLookup": true,
                    'cellEditor': 'agRichSelectCellEditor', 'cellEditorParams': {'valuesObject': [
                        {'lob_level': 'true', 'id': 'true'} 
                        ,{'lob_level': 'false', 'id': 'false'}
                    ],'pullKey': "lob_level"}
                },
                {"field": "lob_name", "valueGetter":"lookup(cost_center_id,   'lob_name')", "editable": false, "showSort": true, "showFilter": true},                
                {"field": "lob_code", "valueGetter":"lookup(cost_center_id,   'lob_code')", "editable": false, "showSort": true, "showFilter": true},
                {"field": "department_name", "valueGetter":"lookup(cost_center_id,    'department_name')", "editable": false, "showSort": true, "showFilter": true},
                {"field": "department_code", "valueGetter":"lookup(cost_center_id,    'department_code')", "editable": false, "showSort": true, "showFilter": true},
                {"field": "specialty_name", "valueGetter":"lookup(cost_center_id,     'specialty_name')", "editable": false, "showSort": true, "showFilter": true},
                {"field": "specialty_code", "valueGetter":"lookup(cost_center_id,     'specialty_code')", "editable": false, "showSort": true, "showFilter": true},
                {"field": "cost_center_name", "valueGetter":"lookup(cost_center_id,   'cost_center_name')", "editable": false, "showSort": true, "showFilter": true},
                {"field": "cost_center_code", "valueGetter":"lookup(cost_center_id,   'cost_center_code')", "editable": false, "showSort": true, "showFilter": true},
                {"field": "last_modified_by_user_email", "chmodParams": 'r', "editable": false, "showSort": true, "showFilter": true },
                {"field": "updated_at", "chmodParams": 'r', "editable": false, "showSort": true, "showFilter": true },
                {"field": "id", "chmodParams": 'rw', "editable": false, "showSort": true, "showFilter": true },
            ],
            "routeParams": {
                "default_route":   "data/provider_effort/user_org_permission",
                'select': {'route':"data/provider_effort/user_org_permissions_rv/select"}
            },
        }
    ]}
    
    module.exports = user_org_permission