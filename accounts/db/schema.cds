namespace Pratham;
//Account Page:-
entity DepartmentView {
    key id              : UUID;
        name            : String;
        email           : String;
        description     : String;
        postalcode      : String;
        createdDateTime : Date;
        applicationType : String;
        createdBy       : String;
        status          : String default 'Active';
        statusCriticality: String default '3';
}
