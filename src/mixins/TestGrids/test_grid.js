let test_grid = {
"grids": [
    {
        "navHeaderParams": {
            "links": [{'name':'providers', 'url': '/providers'}],
            'add_row':   true, 'new_sheet': true
        },
        "columnDefs": [

            {"field": "id",  "editable": false, "showSort": true, 'cellEditorParams': "autoCompleteEditor",
                "cloneOnCopy": false, "showFilter": true, 'chmodParams': 'rw'
            },
            {"field": "company_name","editable": true, "showSort": true, "showFilter": true  },
            {"field": "company_code","editable": true, "showSort": true, "showFilter": true  },
            {"field": "is_active","editable": true, "showSort": true, "showFilter": true  }

        ],
        "routeParams": {
            "default_route": "data/public/company"
        },
        // "tableData": [
        //     {
        //         "id": '1',
        //         "company_name": 'sup',
        //         "company_code": '0',
        //         "is_active": 'true'
        //     },
        // ]
    }
]}

module.exports = test_grid