
entity RootApplicationManagement {                        //Root-Applications
    GroupName     : String;
    NameSpace     : String;
    ApplicationId : String;
    sequenceNo    : String;
}
entity ItemApplicationManagement {                        //Item-Applications
    GroupName     : String;
    NameSpace     : String;
    ApplicationId : String;
    sequenceNo    : String;
    groupid       : Association to RootApplicationManagement
}
