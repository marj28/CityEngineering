import { defineStore } from "pinia";
import axios from "axios";

export const useEquipmentInfo = defineStore("equipmentinfo", {
  state: () => ({
    equipmenthistory: [],
    equipments: [],
    equipment: [],
    equipmentsCount: 0,
    filteredEquipments: [],
    heavyEquipmentsCount: 0,
    lightEquipmentsCount: 0,
  }),

  actions: {
    async UploadImage(id, payload) {
      try {
        let response = await axios.post(
          "http://10.0.1.23:5000/api/Equipments/" + id + "/maintenance",
          payload
        );
        console.log("response=", response);
        // this.equipment.push(response.data);
      } catch (error) {
        console.log(`Error fetching tasks: ${error}`);
      }
    },

    async AddMaintenance(id, payload) {
      try {
        const response = await axios.post(
          "http://10.0.1.23:5000/api/Equipments/" + id + "/maintenance",
          payload
        );
        // this.equipment.push(response.data);
      } catch (error) {
        console.log(`Error fetching tasks: ${error}`);
      }
    },

    async fetchEquipment() {
      try {
        const response = await axios.get(
          "http://10.0.1.23:5000/api/Equipments/"
        );

        this.equipments = response.data;
        this.equipmentsCount = response.data.length;
        // console.log("Equipments=", this.equipments);
        this.filteredEquipments = response.data.filter(
          (equipments) =>
            equipments.EquipmentType === "Heavy" ||
            equipments.EquipmentType === "Light"
        );

        this.heavyEquipmentsCount = this.filteredEquipments.filter(
          (equipments) => equipments.EquipmentType === "Heavy"
        ).length;

        this.lightEquipmentsCount = this.filteredEquipments.filter(
          (equipments) => equipments.EquipmentType === "Light"
        ).length;
        // Count the occurrences of the selected equipment type

        // console.log("Filtered equipments:", this.filteredEquipments);
        // console.log("Heavy equipments count:", this.heavyEquipmentsCount);
        // console.log("Light equipments count:", this.lightEquipmentsCount);
        // console.log("res=", this.equipments);
        // console.log("res=", this.equipmentsCount);
      } catch (error) {
        console.log(`Error fetching tasks: ${error}`);
      }
    },
    async AddEquipment(payload) {
      try {
        const response = await axios.post(
          "http://10.0.1.23:5000/api/Equipments/",
          payload
        );
        this.equipments.push(response.data);
      } catch (error) {
        console.log(`Error fetching tasks: ${error}`);
      }
    },

    async UpdateEquipment(id, payload) {
      try {
        const response = await axios.put(
          `http://10.0.1.23:5000/api/Equipments/` + id,
          payload
        );

        const index = this.equipment.findIndex((e) => e._id === payload._id);
        if (index !== -1) {
          this.equipment[index] = response.data;
        }
      } catch (error) {
        console.log(`Cannot Update ${error}`);
      }
    },
    async DeleteEquipment(id, payload) {
      try {
        await axios.put(
          `http://10.0.1.23:5000/api/Equipments/remove/` + id,
          payload
        );
        const index = this.equipment.findIndex((e) => e._id === payload._id);
        if (index !== -1) {
          this.equipment[index] = response.data;
        }
        // this.equipments = this.equipments.filter((e) => e.id !== id);
      } catch (error) {
        console.log(`Unable to Delete ${error}`);
      }
    },

    // For the Machine Maintenance History

    async GetEquipment(id) {
      console.log("getequipment=", id);
      try {
        const response = await axios.get(
          `http://10.0.1.23:5000/api/Equipments/` + id
        );
        this.equipment = response.data;
        // this.equipmenthistory = Object.values(response.data.MaintenanceDtls);
        // console.log("equipment=",this.equipment);
      } catch (error) {
        console.log("Unable to retrieve=", error);
      }
    },

    async GetEquipmentmaintenanceDetails(id) {
      try {
        const response = await axios.get(
          `http://10.0.1.23:5000/api/Equipments/` + id + `/maintenance`
        );
        this.equipmenthistory = response.data;
      } catch (error) {
        console.log("Unable to retrieve=", error);
      }
    },

    async DeleteMaintenance(id, maintenanceid) {
      try {
        let res = await axios.put(
          `http://10.0.1.23:5000/api/Equipments/` +
            id +
            `/maintenance/remove/` +
            maintenanceid
        );
        // console.log("res =", res.data);
      } catch (error) {
        console.log(`Unable to Delete ${error}`);

        //64fe73740c41be33a4e5de58/maintenance/remove/64fe739d0c41be33a4e5de62
      }
    },
  },
});
