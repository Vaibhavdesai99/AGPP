sap.ui.define(["sap/ui/core/mvc/ControllerExtension", "sap/m/MessageBox"], function (
	ControllerExtension, MessageBox
) {
	"use strict";

	return ControllerExtension.extend("pratham.ext.controller.CreateExt", {
		accept: function () {
			this.createFragment = sap.ui.xmlfragment("pratham.ext.fragments.create", this);
			this.getView().addDependent(this.createFragment);
			this.createFragment.open();
		},
		handle_CloseBtn: function () {
			this.createFragment.destroy();
		},
		onSumbit: function () {
			let that = this;
			const accountName = sap.ui.getCore().byId("idAccountName").getValue();
			const geoAreaCode = sap.ui.getCore().byId("idGeoAreaCode").getSelectedKey();
			const projectType = sap.ui.getCore().byId("idProjectType").getSelectedKeys().join(",");
			const description = sap.ui.getCore().byId("idDescription").getValue();
			if (accountName === "" && geoAreaCode === "" && projectType.length === 0) {
				sap.ui.getCore().byId("idAccountName").setValueState("Error");
				sap.ui.getCore().byId("idAccountName").setValueStateText("Account Name is Mandatory");
				sap.ui.getCore().byId("idGeoAreaCode").setValueState("Error");
				sap.ui.getCore().byId("idGeoAreaCode").setValueStateText("Geographical Area Code is Mandatory");
				sap.ui.getCore().byId("idProjectType").setValueState("Error");
				sap.ui.getCore().byId("idProjectType").setValueStateText("Project Type is Mandatory");
			}
			else if (accountName === "") {
				sap.ui.getCore().byId("idAccountName").setValueState("Error");
				sap.ui.getCore().byId("idAccountName").setValueStateText("Account Name is Mandatory");
			}
			else if (geoAreaCode === "") {
				sap.ui.getCore().byId("idGeoAreaCode").setValueState("Error");
				sap.ui.getCore().byId("idGeoAreaCode").setValueStateText("Geographical Area Code is Mandatory");
			}
			else if (projectType.length === 0) {
				sap.ui.getCore().byId("idProjectType").setValueState("Error");
				sap.ui.getCore().byId("idProjectType").setValueStateText("Project Type is Mandatory");
			} else {
				const data = {
					name: accountName,
					postalcode: geoAreaCode,
					applicationType: projectType,
					description: description
				}
				let oModel = this.getView().getModel().bindList("/deptviews");

				oModel.create(data);
				oModel.requestContexts().then(
					() => {
						MessageBox.success("Account Created Succcessfully");
						this.createFragment.destroy();
						that.getView().getModel().refresh();
					}
				).catch((err) => {
					MessageBox.error(err);
				})
			}
		}
	});
});
