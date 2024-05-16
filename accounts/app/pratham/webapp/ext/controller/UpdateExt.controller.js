sap.ui.define(['sap/ui/core/mvc/ControllerExtension', "sap/m/MessageBox"], function (ControllerExtension, MessageBox) {
	'use strict';

	return ControllerExtension.extend('pratham.ext.controller.UpdateExt', {
		// this section allows to extend lifecycle hooks or hooks provided by Fiori elements
		override: {
			/**
			 * Called when a controller is instantiated and its View controls (if available) are already created.
			 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
			 * @memberOf pratham.ext.controller.UpdateExt
			 */
			onInit: function () {
				// you can access the Fiori elements extensionAPI via this.base.getExtensionAPI
				// var oModel = this.base.getExtensionAPI().getModel();
			}
		}, accept: function () {
			this.updateFragment = sap.ui.xmlfragment("pratham.ext.fragments.update", this);
			this.getView().addDependent(this.updateFragment);
			this.updateFragment.open()

			const data = this.base.getExtensionAPI().getSelectedContexts()[0].getObject()
			if (data.name) {
				sap.ui.getCore().byId("idAccountName").setValue(data.name);
				sap.ui.getCore().byId("idGeoAreaCode").setSelectedKey(data.postalcode);
				sap.ui.getCore().byId("idProjectType").setSelectedKeys(data.applicationType.split(","));
				sap.ui.getCore().byId("idDescription").setValue(data.description);
			}

			this.id = this.base.getExtensionAPI().getSelectedContexts()[0].getValue().id;

		}, handle_CloseBtn: function () {
			this.updateFragment.destroy()
		},
		onSumbit: function () {
			let that = this;
			const accountName = sap.ui.getCore().byId("idAccountName").getValue();
			const geoAreaCode = sap.ui.getCore().byId("idGeoAreaCode").getSelectedKey();
			const projectType = sap.ui.getCore().byId("idProjectType").getSelectedKeys().join(",");
			const description = sap.ui.getCore().byId("idDescription").getValue();
			let filterName = this.base.getExtensionAPI().getSelectedContexts()[0].getValue().name;

			if (accountName === "") {
				sap.ui.getCore().byId("idAccountName").setValueState("Error");
				sap.ui.getCore().byId("idAccountName").setValueStateText("Account Name is Mandatory");
			}
			else {

				let oModel = this.getView().getModel().bindList(`/deptviews`);
				let aFilter = new sap.ui.model.Filter(
					"name",
					sap.ui.model.FilterOperator.EQ,
					filterName
				);
				oModel
					.filter(aFilter)
					.requestContexts()
					.then(function (aContexts) {
						aContexts[0].setProperty("name", accountName);
						aContexts[0].setProperty("postalcode", geoAreaCode);
						aContexts[0].setProperty("applicationType", projectType);
						aContexts[0].setProperty("description", description);
						that.getView().getModel().refresh();
						that.updateFragment.destroy();
						MessageBox.success("Account Data Updated successful");
					})
					.catch((err) => MessageBox.error("Error : " + err));
			}
		},
	});
});
