<template>
  <div class="q-pa-md">
    <q-btn
      icon="add"
      color="green-10"
      label="Add IT Equipment"
      @click="Rowclick"
      class="q-mb-sm"
      v-if="create('IT Equipment')"
    />
    <q-btn
      label="Download CSV"
      flat
      class="q-mb-sm"
      style="color: green"
      @click="exportToExcel"
    ></q-btn>
    <q-table
      class="my-sticky-header-table"
      wrap-cells=""
      flat
      bordered
      title="IT EQUIPMENT LIST"
      dense
      :rows="filteredIT"
      :columns="columns"
      row-key="id"
      :rows-per-page-options="[20]"
    >
      <template v-slot:top-right>
        <q-input
          color="green"
          style="margin-bottom: 20px"
          dense
          debounce="300"
          v-model="filter"
          placeholder="Search"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>

      <template v-slot:body-cell-MaintenanceType="{ row }">
        <q-td>
          {{
            row.MaintenanceDtls[0]
              ? row.MaintenanceDtls[0].MaintenanceType
              : null
          }}
        </q-td>
      </template>
      <template v-slot:body-cell-MaintenanceDate="{ row }">
        <q-td>
          {{
            row.MaintenanceDtls[0]
              ? formatDate(row.MaintenanceDtls[0].MaintenanceDate)
              : null
          }}
        </q-td>
      </template>
      <template v-slot:body-cell-MaintenanceDesc="{ row }">
        <q-td>
          {{
            row.MaintenanceDtls[0]
              ? row.MaintenanceDtls[0].MaintenanceDesc
              : null
          }}
        </q-td>
      </template>

      <template v-slot:body-cell-actions="{ row }">
        <div class="actionsbtn">
          <!-- <q-btn
            v-if="update('IT Equipment')"
            icon="add"
            size="sm"
            round
            color="green"
            @click="viewItem(row)"
          >
          </q-btn> -->
          <q-btn
            v-if="update('IT Equipment')"
            icon="visibility"
            flat
            round
            color="green-8"
            style="margin-right: -10px"
            @click="editItem(row)"
          >
          </q-btn>
          <q-btn
            v-if="remove('IT Equipment')"
            icon="delete"
            flat
            round
            color="deep-orange"
            @click="deleteItem(row)"
          >
          </q-btn>
        </div>
      </template>
    </q-table>

    <!-- DIALOG FOR DETAILS -->
    <q-dialog v-model="dialogVisible" persistent>
      <q-card style="width: 500px; max-width: 80vw; height: 470px; ">
        <q-toolbar class="q-pa-md">
          <q-toolbar-title
            ><span class="text-weight-bold"
              >IT EQUIPMENT DETAILS</span
            ></q-toolbar-title
          >
          <q-btn
            flat
            round
            dense
            icon="close"
            v-close-popup
            color="orange"
            @click="this.isEditMode = false"
            v-show="exitBtn"
          />
        </q-toolbar>
        <!-- <q-card-section>
          <div class="row">
            <div class="col-11 text-h6">IT EQUIPMENT DETAILS</div>
            <div class="col-1">
              <q-btn
                flat
                round
                color="orange"
                icon="close"
                v-close-popup
                @click="this.isEditMode = false"
                v-show="exitBtn"
              />
            </div>
          </div>
        </q-card-section> -->
        <q-separator />

        <q-card-section style="max-height: 50vh" class="scroll">
          <q-form>
            <div class="row">
              <div class="col-12">
                <q-input
                  ref="machinename"
                  :rules="[this.required]"
                  lazy-rules
                  filled
                  v-model="editedItem.MachineName"
                  :disable="maintenancehistory === !isEditMode"
                  label="Equipment Name"
                  dense
                  class="q-pa-sm q-mb-sm"
                />
              </div>
              <div class="col-12">
                <div class="q-gutter-md">
                  <q-select
                    ref="equipmentType"
                    :rules="[this.required]"
                    lazy-rules
                    filled
                    v-model="editedItem.EquipmentType"
                    :disable="maintenancehistory === !isEditMode"
                    dense
                    use-input
                    class="q-pa-sm q-mb-sm"
                    :options="options"
                    label="Equipment Type"
                  />
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col">
                <q-input
                  ref="propertyCustodian"
                  :rules="[this.required]"
                  lazy-rules
                  filled
                  v-model="editedItem.PropertyCustodian"
                  :disable="maintenancehistory === !isEditMode"
                  label="Property Custodian"
                  dense
                  class="q-pa-sm q-mb-sm"
                />
              </div>
            </div>
            <div class="row">
              <div class="col-12">
                <q-input
                  ref="serialno"
                  :rules="[this.required]"
                  lazy-rules
                  filled
                  v-model="editedItem.SerialNo"
                  :disable="maintenancehistory === !isEditMode"
                  label="Serial Number"
                  dense
                  class="q-pa-sm q-mb-sm"
                />
              </div>
              <div class="col-12">
                <q-input
                  filled
                  v-model="editedItem.Remarks"
                  :disable="maintenancehistory === !isEditMode"
                  label="Remarks"
                  dense
                  class="q-pa-sm"
                />
              </div>
            </div>
          </q-form>
        </q-card-section>

        <q-card-actions align="right" class="q-mr-md">
          <q-btn
            flat
            icon="edit"
            color="orange"
            size="md"
            @click="toggleEditMode()"
            v-show="maintenancehistory"
          />
          <q-btn
            label="Save"
            color="green-5"
            size="md"
            @click="save"
            class=""
            :disable="maintenancehistory === !isEditMode"
          />
        </q-card-actions>
        <!-- <q-card class="q-px-lg q-pt-sm q-mb-md">
          <q-btn
            style="width: 100%"
            class="btn-fixed-width"
            color="green-10"
            label="VIEW MAINTENANCE HISTORY"
            icon="lightbulb_outline"
            @click="ITMaintenanceDialog = true"
            v-show="maintenancehistory"
          />
        </q-card> -->
      </q-card>

      <!-- DIALOG FOR MAINTENANCE -->
      <q-card
      style="width: 500px; max-width: 80vw; height: 470px; "
        v-show="maintenancehistory"
      >
        <q-toolbar class="q-pa-md">
          <q-toolbar-title
            ><span class="text-weight-bold"
              >MAINTENANCE HISTORY</span
            ></q-toolbar-title
          >
          <q-btn flat dense icon="close" v-close-popup color="orange" />
        </q-toolbar>
        <q-separator />

        <!-- <q-card-section class="scroll">
          <div class="row">
            <div class="col-11 text-h6">IT EQUIPMENT MAINTENANCE HISTORY</div>
            <div class="col-1">
              <q-btn
                flat
                round
                color="orange"
                icon="close"
                v-close-popup
                style="margin-bottom: -5px; margin-top: -5px"
              />
            </div>
          </div>
        </q-card-section> -->
        <q-card-section style="max-height: 50vh" class="scroll">
          <q-table
            class="my-sticky-header-table"
            flat
            bordered
            title=""
            wrap-cells=""
            dense
            :rows="store.itequipmenthistory"
            :columns="history"
            :filter="filter"
            row-key="id"
          >
            <template v-slot:top-right>
              <q-input
                color="green"
                dense
                debounce="300"
                v-model="filter"
                placeholder="Search"
              >
                <template v-slot:append>
                  <q-icon name="search" />
                </template>
              </q-input>
            </template>
            <template v-slot:top-left>
              <q-btn
                label="Add Maintenance"
                size="x-small"
                icon="add"
                @click="secondDialog = true"
                color="green-10"
              ></q-btn>
            </template>

            <template v-slot:body-cell-MaintenanceType="{ row }">
              <q-td>
                {{ row.MaintenanceType }}
              </q-td>
            </template>
            <template v-slot:body-cell-MaintenanceDate="{ row }">
              <q-td>
                {{ formatDate(row.MaintenanceDate) }}
              </q-td>
            </template>
            <template v-slot:body-cell-MaintenanceDesc="{ row }">
              <q-td>
                {{ row.MaintenanceDesc }}
              </q-td>
            </template>

            <template v-slot:body-cell-actions="{ row }">
              <div class="actionsbtn">
                <q-btn
                  icon="visibility"
                  flat
                  round
                  color="green"
                  @click="viewUpdate(row)"
                >
                </q-btn>
                <q-btn
                  icon="delete"
                  flat
                  round
                  color="deep-orange"
                  @click="deleteMaintenance(row._id)"
                >
                </q-btn>
              </div>
            </template>
          </q-table>
        </q-card-section>

        <!-- <div style="position: absolute; bottom: 10px; right: 10px">
          <q-btn
            label=""
            size="15px"
            @click="secondDialog = true"
            icon="add"
            color="green-10"
            round
            style="position: absolute; bottom: 0; right: 0"
            ><q-tooltip class="white"
              >Create new Maintenance History</q-tooltip
            ></q-btn
          >
        </div> -->
      </q-card>
    </q-dialog>

    <q-dialog
      v-model="MachineDeleteHistory"
      persistent
      transition-show="scale"
      transition-hide="scale"
    >
      <q-card class="bg-red text-white" style="width: 400px">
        <q-card-section>
          <div class="text-h6">Delete IT Equipment Maintenance History</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          Do you want to delete this Equipment Maintenance History?
        </q-card-section>

        <q-card-actions align="right" class="bg-white text-teal">
          <q-btn
            flat
            label="Cancel"
            size="small"
            color="orange"
            v-close-popup
            autofocus
          />
          <q-btn
            label="OK"
            flat
            color="green-5"
            size="small"
            v-close-popup
            @click="deleteMachineHistory()"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Dialog for vIEWING EACH IT EQUIPMENT MAINTENANCE HISTORY -->
    <q-dialog
      v-model="viewUpdateId"
      transition-show="scale"
      transition-hide="scale"
    >
      <q-card class="" style="min-width: 50%">
        <q-card-section style="max-height: 50vh" class="scroll">
          <div class="row text-h6">
            <div class="col-11">IT EQUIPMENT MAINTENANCE HISTORY VIEW</div>
            <div class="col-1">
              <q-btn
                flat
                round
                color="orange"
                icon="close"
                @click="this.viewUpdateId = false"
              />
            </div>
          </div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <div class="row">
            <div class="col-12">
              <p>
                <b>DATE:</b> {{ formatDate(selectedUpdate.MaintenanceDate) }}
              </p>
              <p class="q-mb-sm"><b>TYPE: </b></p>
              <p class="q-ml-md">{{ selectedUpdate.MaintenanceType }}</p>
              <p class="q-mb-sm"><b>DESCRIPTION: </b></p>
              <p class="q-ml-md">{{ selectedUpdate.MaintenanceDesc }}</p>
              <p class="q-mb-sm"><b>PROOF:</b></p>
              <q-img
                style="height: 400px; max-width: 100%"
                :src="selectedUpdate.MaintenanceImage"
              />
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog
      v-model="secondDialog"
      persistent
      transition-show="scale"
      transition-hide="scale"
    >
      <q-card class="" style="width: 500px">
        <q-toolbar>
          <q-toolbar-title
            ><span class="text-weight-bold"
              >ADD MAINTENANCE</span
            ></q-toolbar-title
          >
          <q-btn flat round dense icon="close" v-close-popup color="orange" />
        </q-toolbar>
        <!-- <q-card-section>
          <div class="row text-h6">
            <div class="col-11">ADD MAINTENANCE</div>
            <div class="col-1">
              <q-btn flat round color="orange" icon="close" v-close-popup />
            </div>
          </div>
        </q-card-section> -->
        <q-separator />
        <q-card-section>
          <div class="row">
            <div class="col-6 col-xs-12 col-sm-6">
              <q-input
                ref="maintenanceType"
                :rules="[this.required]"
                lazy-rules
                filled
                v-model="MaintDtl.MaintenanceType"
                label="Maintenance Type"
                dense
                class="q-pa-sm q-mb-sm"
              />
            </div>
            <div class="col-6 col-xs-12 col-sm-6">
              <q-input
                ref="maintenanceDate"
                :rules="[this.required]"
                lazy-rules
                filled
                v-model="MaintDtl.MaintenanceDate"
                label="Maintenance Date"
                dense
                class="q-pa-sm"
                type="date"
              />
            </div>
          </div>
          <!-- image for update/edit -->
          <div class="row">
            <div class="col">
              <q-file
                ref="maintenanceProof"
                :rules="[this.requiredProof]"
                lazy-rules
                filled
                v-model="MaintDtl.MaintenanceImage"
                hint="Maintenance Proof"
                use-chips
                dense
                class="q-pa-sm q-mb-sm"
                accept=".jpg, image/*"
              />
            </div>
          </div>
          <div class="row">
            <div class="col">
              <q-input
                ref="maintenanceDesc"
                :rules="[this.required]"
                lazy-rules
                filled
                v-model="MaintDtl.MaintenanceDesc"
                label="Maintenance Description"
                dense
                class="q-pa-sm"
                type="textarea"
              />
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="orange" v-close-popup size="md" />
          <q-btn
            label="Save"
            color="green-5"
            size="md"
            @click="savehistory()"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- For the Delete of the Maintenance History -->
    <q-dialog
      v-model="MaintenanceDelete"
      persistent
      transition-show="scale"
      transition-hide="scale"
    >
      <q-card class="bg-red text-white" style="width: 400px">
        <q-card-section>
          <div class="text-h6">Delete IT Equipment</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          Do you want to delete this IT Equipment?
        </q-card-section>

        <q-card-actions align="right" class="bg-white text-teal">
          <q-btn
            flat
            label="Cancel"
            size="small"
            color="orange"
            autofocus
            v-close-popup
          />
          <q-btn
            label="OK"
            flat
            color="green-5"
            v-close-popup
            @click="deleteItemConfirm(row)"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { ref } from "vue";
import { useITEquipmentInfo } from "../stores/ItStore";
import { useLoginStore } from "src/stores/LoginStore";
import * as XLSX from "xlsx";

export default {
  data() {
    return {
      selectedID: ref(""),
      MachineDeleteHistory: false,
      DeleteHistoryId: "",
      DeletedItem: [],
      DeleteId: "",
      MaintenanceDelete: false,
      isEditMode: false,
      exitBtn: false,
      viewUpdateId: false,
      selectedUpdate: null,
      maintenancehistory: true,
      myEquipments: [],
      filter: "",
      ITMaintenanceDialog: false,
      dialogVisible: false,
      secondDialog: false,
      editedIndex: -1,
      editedItem: {
        id: null,
        MachineName: "",
        EquipmentType: "",
        PropertyCustodian: "",
        SerialNo: "",
        IsDeleted: false,
        MaintenanceDtls: {
          0: {
            MaintenanceType: "",
            MaintenanceDate: "",
            MaintenanceImage: "",
            MaintenanceDesc: "",
            IsDeleted: false,
          },
        },
        Remarks: "",
      },
      MaintDtl: [
        {
          MaintenanceType: "",
          MaintenanceDate: "",
          MaintenanceImageProof: "",
          MaintenanceDesc: "",
          IsDeleted: false,
        },
      ],
      defaultItem: {
        id: null,
        MachineName: "",
        EquipmentType: "",
        PropertyCustodian: "",
        IsDeleted: false,
        SerialNo: "",
        MaintenanceDtls: {
          MaintenanceType: "",
          MaintenanceDate: "",
          MaintenanceImage: "",
          MaintenanceDesc: "",
          IsDeleted: false,
        },
        Remarks: "",
      },
      options: [
        "Computer",
        "Multi-function Printer",
        "Laptop",
        "Projector",
        "Mouse",
        "Telephone",
        "Network Items",
      ],
      columns: [
        {
          name: "MachineName",
          required: true,
          label: "MACHINE NAME",
          align: "left",
          field: (row) => row.MachineName,
          format: (val) => `${val}`,
          sortable: true,
        },

        {
          name: "EquipmentType",
          label: "EQUIPMENT TYPE",
          field: "EquipmentType",
          align: "left",
          sortable: true,
        },
        {
          name: "PropertyCustodian",
          label: "PROPERTY CUSTODIAN",
          field: "PropertyCustodian",
          align: "left",
        },
        {
          name: "SerialNo",
          align: "left",
          label: "SERIAL NUMBER",
          field: "SerialNo",
        },
        {
          name: "MaintenanceDate",
          align: "left",
          label: "MAINTENANCE DATE",
          field: "row.MaintenanceDtls.MaintenanceDate",
          sortable: true,
        },
        {
          name: "MaintenanceType",
          align: "left",
          label: "MAINTENANCE TYPE",
          field: "row.MaintenanceDtls.MaintenanceType",
          sortable: true,
        },
        {
          name: "actions",
          label: "ACTIONS",
          field: "actions",
          align: "left",
        },
      ],
      history: [
        {
          name: "MaintenanceDate",
          align: "left",
          label: "Maintenance Date",
          field: "MaintenanceDate",
          sortable: true,
        },
        {
          name: "MaintenanceType",
          align: "left",
          label: "Maintenance Type",
          field: "MaintenanceType",
          sortable: true,
        },
        {
          name: "MaintenanceDesc",
          align: "left",
          label: "Maintenance Description",
          field: "MaintenanceDesc",
          sortable: true,
        },
        {
          name: "actions",
          align: "left",
          label: "Action",
          field: "actions",
          sortable: true,
        },
      ],
    };
  },
  computed: {
    maintenancedetailsOptions() {
      if (this.editedItem.MaintenanceDtls) {
        // console.log("maintenancedetails=",Object.values(this.editItem.MaintenanceDtls))
        return Object.values(this.editedItem.MaintenanceDtls);
      } else {
        return {};
      }
    },
    filteredIT() {
      const searchTerm = this.filter.toLowerCase();
      return this.store.itequipments.filter((machine) => {
        const EquipmentType = machine.EquipmentType
          ? machine.EquipmentType.toLowerCase()
          : "";
        const MachineName = machine.MachineName
          ? machine.MachineName.toLowerCase()
          : "";
        const PropertyCustodian = machine.PropertyCustodian
          ? machine.PropertyCustodian.toLowerCase()
          : "";
        const SerialNo = machine.SerialNo ? machine.SerialNo.toLowerCase() : "";
        const MaintenanceDtls = machine.MaintenanceDtls[0] || {}; // Assuming there's at least one employment detail

        const MaintenanceType = MaintenanceDtls.MaintenanceType
          ? MaintenanceDtls.MaintenanceType.toLowerCase()
          : "";
        const MaintenanceDate = MaintenanceDtls.MaintenanceDate
          ? MaintenanceDtls.MaintenanceDate.toLowerCase()
          : "";
        const MaintenanceDesc = MaintenanceDtls.MaintenanceDesc
          ? MaintenanceDtls.MaintenanceDesc.toLowerCase()
          : "";

        return (
          EquipmentType.includes(searchTerm) ||
          MachineName.includes(searchTerm) ||
          PropertyCustodian.includes(searchTerm) ||
          SerialNo.includes(searchTerm) ||
          MaintenanceType.includes(searchTerm) ||
          MaintenanceDate.includes(searchTerm) ||
          MaintenanceDesc.includes(searchTerm)
        );
      });
    },
  },
  methods: {
    // MaintenanceDelete1(id){
    //   this.MaintenanceDelete=true;
    //   console.log("Delete =>", id._id)
    // },

    toggleEditMode() {
      console.log("toggleEditMode called");
      this.isEditMode = !this.isEditMode;
    },

    Rowclick() {
      this.maintenancehistory = false;
      this.exitBtn = true;

      this.editedItem = {
        id: null,
        MachineName: "",
        EquipmentType: "",
        PropertyCustodian: "",
        IsDeleted: false,
        SerialNo: "",
        // MaintenanceDtls: {
        //   MaintenanceType: "",
        //   MaintenanceDate: "",
        //   MaintenanceDesc: "",
        // },
        Remarks: "",
      };
      this.dialogVisible = true;
    },
    formatDate(value) {
      if (!value) return "";

      const date = new Date(value);

      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const day = date.getDate().toString().padStart(2, "0");

      return `${year}-${month}-${day}`;
    },
    editItem(item) {
      this.selectedID = item._id;
      this.exitBtn = false;
      this.maintenancehistory = true;
      const store = useITEquipmentInfo();

      store.GetITEquipment(item._id).then((res) => {
        this.editedItem = store.itequipment;
        // store.fetchITEquipment();
        console.log("sdasda=", this.editedItem);
      });
      console.log("thisthis=", this.editedItem.MaintenanceDtls);
      store.GetITEquipmentmaintenanceDetails(item._id);
      this.dialogVisible = true;
    },
    viewItem(item) {
      this.ITMaintenanceDialog = true;
      const store = useITEquipmentInfo();

      store.GetITEquipment(item._id).then((res) => {
        this.editedItem = store.itequipment;
        // store.fetchEquipment();
        console.log("sdasda=", this.editedItem);
      });
      this.dialogVisible = false;
    },

    deleteItem(id) {
      console.log("Delete Item ID => ", id._id);
      // const store = useITEquipmentInfo();
      // store.DeleteITEquipment(id._id).then((res) => {
      //   store.fetchITEquipment();
      // });
      this.DeletedItem = id;
      this.DeleteId = id._id;
      this.MaintenanceDelete = true;
    },

    deleteItemConfirm() {
      const editedItemCopy = { ...this.editedItem };
      // console.log("Delete Item ID => ", this.DeleteId);
      const store = useITEquipmentInfo();
      editedItemCopy.IsDeleted = true;

      store.DeleteITEquipment(this.DeleteId, this.DeletedItem).then((res) => {
        store.fetchITEquipment();
      });
    },

    deleteMaintenance(maintenanceid) {
      this.DeleteHistoryId = maintenanceid;
      this.MachineDeleteHistory = true;
      // console.log("editeditem=", this.editedItem);
      // const id = this.editedItem._id;
      // console.log("Maintenance ID =>", id + "----" + maintenanceid);

      // const store = useEquipmentInfo();
      // store.DeleteMaintenance(id._id, maintenanceid).then((res) => {
      //   store.GetEquipment(id._id);
      // });

      // const store = useITEquipmentInfo();
      // const editedItemCopy = { ...this.editedItem.MaintenanceDtls };
      // store.DeleteITMaintenance(id, maintenanceid).then((req) => {
      //   store.fetchITEquipment();
      //   store.GetITEquipment(id).then((res) => {
      //     this.editedItem = store.itequipment;
      //   });
      // });
    },

    deleteMachineHistory() {
      console.log("Machine Maintenance ID =>", this.DeleteHistoryId);
      console.log("Selected ID =>", this.selectedID);

      const store = useITEquipmentInfo();
      store
        .DeleteITMaintenance(this.selectedID, this.DeleteHistoryId)
        .then((req) => {
          store
            .GetITEquipmentmaintenanceDetails(this.selectedID)
            .then((res) => {
              this.editedItem = store.itequipment;
              store.fetchITEquipment();
            });
        });
    },

    viewUpdate(row) {
      this.selectedUpdate = row;
      this.viewUpdateId = true;
      // this.viewUpdateId = true;
      // const id = this.editedItem._id;

      // const store = useStoreProjectInfo();
      // store.GetProject(id);
    },
    required(val) {
      return (val && val.length > 0) || "Field must be filled in";
    },
    requiredProof(val) {
      return (val !== null && val !== undefined) || "Field must be filled in";
    },
    save() {
      this.$refs.machinename.validate();
      this.$refs.equipmentType.validate();
      this.$refs.propertyCustodian.validate();
      this.$refs.serialno.validate();

      if (
        !this.$refs.machinename.hasError &&
        !this.$refs.equipmentType.hasError &&
        !this.$refs.propertyCustodian.hasError &&
        !this.$refs.serialno.hasError
      ) {
        const store = useITEquipmentInfo();
        const editedItemCopy = { ...this.editedItem };
        console.log("edited item =>", editedItemCopy);

        if (editedItemCopy._id) {
          store
            .UpdateITEquipment(editedItemCopy._id, editedItemCopy)
            .then((res) => {
              this.closeDialog();
              this.editedItem = {
                MachineName: "",
                EquipmentType: "",
                IsDeleted: false,
                PropertyCustodian: "",
                SerialNo: "",
                Remarks: "",
              };
              store.fetchITEquipment().then((res) => {

                this.isEditMode = false;
              });
            });
          console.log("Item Updated: ", editedItemCopy);
        } else {
          store.AddITEquipment(editedItemCopy).then((res) => {
            this.closeDialog();
            this.editedItem = {
              id: null,
              MachineName: "",
              EquipmentType: "",
              PropertyCustodian: "",
              SerialNo: "",
              IsDeleted: false,
              Remarks: "",
            };
            store.fetchITEquipment().then((res) => {

            });
          });
          console.log("save=", editedItemCopy);
        }
      }
    },
    savehistory() {
      this.$refs.maintenanceType.validate();
      this.$refs.maintenanceDate.validate();
      this.$refs.maintenanceProof.validate();
      this.$refs.maintenanceDesc.validate();
      if (
        !this.$refs.maintenanceType.hasError &&
        !this.$refs.maintenanceDate.hasError &&
        !this.$refs.maintenanceProof.hasError &&
        !this.$refs.maintenanceProof.hasError
      ) {
        console.log("ID NAKO >> ", this.selectedID);
        const store = useITEquipmentInfo();

        const formData = new FormData();
        formData.append("MaintenanceType", this.MaintDtl.MaintenanceType);
        formData.append("MaintenanceDate", this.MaintDtl.MaintenanceDate);
        formData.append("file", this.MaintDtl.MaintenanceImage);
        formData.append("MaintenanceImage", "");
        formData.append("MaintenanceDesc", this.MaintDtl.MaintenanceDesc);
        store.UploadImage(this.selectedID, formData).then((res) => {
          store.GetITEquipmentmaintenanceDetails(this.selectedID);
          store.fetchITEquipment();
          this.MaintDtl = [
            {
              MaintenanceType: "",
              MaintenanceDate: "",
              MaintenanceImageProof: "",
              MaintenanceDesc: "",
              IsDeleted: false,
            },
          ];
        });
        this.secondDialog = false;
      }
    },
    closeDialog() {
      this.editedItem = {
        id: null,
        MachineName: "",
        EquipmentType: "",
        PropertyCustodian: "",
        SerialNo: "",
        MaintenanceDtls: {
          MaintenanceType: "",
          MaintenanceDate: "",
          MaintenanceImage: "",
          MaintenanceDesc: "",
        },
        Remarks: "",
      };
      this.dialogVisible = false;
    },
    getNextId() {
      const ids = this.rows.map((item) => item.id);
      return Math.max(...ids) + 1;
    },
    exportToExcel() {
      const data = [
        [
          "EquipmentType",
          "MachineName",
          "PropertyCustodian",
          "MaintenanceType",
          "MaintenanceDate",
          "MaintenanceDesc",
        ],
        ...this.filteredIT.map((row) => [
          row.EquipmentType || "",
          row.MachineName || "",
          row.PropertyCustodian || "",
          row.MaintenanceDtls[0]?.MaintenanceType || "",
          this.formatDate(row.MaintenanceDtls[0]?.MaintenanceDate) || "",
          row.MaintenanceDtls[0]?.MaintenanceDesc || "",
        ]),
      ];

      // Create a workbook with a worksheet
      const ws = XLSX.utils.aoa_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "IT Equipment Data");

      // Save the workbook as a .xlsx file
      XLSX.writeFile(wb, "ItEquipment_Data.xlsx");
    },
  },

  setup() {
    const store = useITEquipmentInfo();
    store.fetchITEquipment();
    const loginstore = useLoginStore();

    //REMOVE FUNCTION
    function remove(module) {
      const userCredentials = loginstore.user.Credentials;
      const moduleCredentials = userCredentials.find(
        (cred) => cred.Module === module
      );
      // console.log("credentials=", moduleCredentials);
      if (moduleCredentials.Remove) {
        return true;
      } else {
        return false;
      }
    }
    //EDIT FUNCTION
    function update(module) {
      const userCredentials = loginstore.user.Credentials;
      const moduleCredentials = userCredentials.find(
        (cred) => cred.Module === module
      );
      // console.log("credentials=", moduleCredentials);
      if (moduleCredentials.Update) {
        return true;
      } else {
        return false;
      }
    }
    //CREATE FUNCTION
    function create(module) {
      const userCredentials = loginstore.user.Credentials;
      const moduleCredentials = userCredentials.find(
        (cred) => cred.Module === module
      );
      // console.log("credentials=", moduleCredentials);
      if (moduleCredentials.Create) {
        return true;
      } else {
        return false;
      }
    }

    return {
      remove,
      update,
      create,
      store,
      model: ref(null),
    };
  },
};
</script>

<style scoped>
.my-card {
  width: 100%;
  max-width: 250px;
  margin: 10px;
}
/* .actionsbtn {
  margin-left: 90px;
} */
</style>
