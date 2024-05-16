using Pratham from '../db/schema';

//Service entity :-

service Account {
    entity deptviews as projection on Pratham.DepartmentView;

}
