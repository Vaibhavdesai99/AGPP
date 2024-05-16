using Account as service from '../../srv/Account';
annotate service.deptviews with @(
    
    UI.FieldGroup #GeneratedGroup : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Label : 'Account Name',
                Value : name,
            },
            // {
            //     $Type : 'UI.DataField',
            //     Label : 'Email',
            //     Value : email,
            // },
            {
                $Type : 'UI.DataField',
                Label : 'Description',
                Value : description,
            },
            {
                $Type : 'UI.DataField',
                Label : 'Postal Code',
                Value : postalcode,
            },
            {
                $Type : 'UI.DataField',
                Label : 'created On',
                Value : createdDateTime,
            },
            // {
            //     $Type : 'UI.DataField',
            //     Label : 'isDeleted',
            //     Value : isDeleted,
            // },
            {
                $Type : 'UI.DataField',
                Label : 'Application Type',
                Value : applicationType,
            },
        ],
    },

    // for F4 Help

    UI.SelectionFields: [
        name,
        postalcode,
        createdDateTime,
        createdBy,
        status
    ], 
    
    UI.Facets : [
        {
            $Type : 'UI.ReferenceFacet',
            ID : 'GeneratedFacet1',
            Label : 'General Information',
            Target : '@UI.FieldGroup#GeneratedGroup',
        },
    ],
    UI.LineItem : [
        {
            $Type : 'UI.DataField',
            Label : 'Account Name',
            Value : name,
        },
        {
            $Type : 'UI.DataField',
            Label : 'Geographical Area Code',
            Value : postalcode,
        },
        
        {
            $Type : 'UI.DataField',
            Label : 'Created On',
            Value : createdDateTime,
        },
        {
            $Type : 'UI.DataField',
            Label : 'Created By',
            Value : createdBy,
        },
        {
            $Type : 'UI.DataField',
            Label : 'Status',
            Value : status,
            Criticality : statusCriticality,
        },
    ],
);

annotate service.deptviews with {
    name @Common.Label : 'Account Name'
};
annotate service.deptviews with {
    postalcode @Common.Label : 'Geographical Area Code'
};
annotate service.deptviews with {
    createdDateTime @Common.Label : 'Created On'
};
annotate service.deptviews with {
    createdBy @Common.Label : 'Created By'
};
annotate service.deptviews with {
    status @Common.Label : 'Status'
};

annotate service.deptviews with {
    name @(Common.ValueList : {
            $Type : 'Common.ValueListType',
            CollectionPath : 'deptviews',
            Parameters : [
                {
                    $Type : 'Common.ValueListParameterInOut',
                    LocalDataProperty : name,
                    ValueListProperty : 'name',
                },
            ], // for getting table inside F4 Help
            Label : 'Account Name',
        },
)};
annotate service.deptviews with {
    postalcode @(Common.ValueList : {
            $Type : 'Common.ValueListType',
            CollectionPath : 'deptviews',
            Parameters : [
                {
                    $Type : 'Common.ValueListParameterInOut',
                    LocalDataProperty : postalcode,
                    ValueListProperty : 'postalcode',
                },
            ], // for getting table inside F4 Help
            Label : 'Geographical Area Code',
        },
        Common.ValueListWithFixedValues : true // for drop down
)};
annotate service.deptviews with {
    createdDateTime @(Common.ValueList : {
            $Type : 'Common.ValueListType',
            CollectionPath : 'deptviews',
            Parameters : [
                {
                    $Type : 'Common.ValueListParameterInOut',
                    LocalDataProperty : createdDateTime,
                    ValueListProperty : 'createdDateTime',
                },
            ], // for getting table inside F4 Help
            Label : 'Created On',
        },
)};
annotate service.deptviews with {
    createdBy @(Common.ValueList : {
            $Type : 'Common.ValueListType',
            CollectionPath : 'deptviews',
            Parameters : [
                {
                    $Type : 'Common.ValueListParameterInOut',
                    LocalDataProperty : createdBy,
                    ValueListProperty : 'createdBy',
                },
            ], // for getting table inside F4 Help
            Label : 'Created By',
        },
)};
annotate service.deptviews with {
    status @(Common.ValueList : {
            $Type : 'Common.ValueListType',
            CollectionPath : 'deptviews',
            Parameters : [
                {
                    $Type : 'Common.ValueListParameterInOut',
                    LocalDataProperty : status,
                    ValueListProperty : 'status',
                },
            ], // for getting table inside F4 Help
            Label : 'Status',
        },
)};
