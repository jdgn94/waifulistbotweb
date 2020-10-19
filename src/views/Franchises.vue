<template>
  <div id="framchises">
    <div class="search-bar" id="search-barr">
      <v-row>
        <v-col cols="11">
          <v-text-field
            label="Search"
            hint="search for name, nickname"
            v-model="name"
            @keyup="searchTime"
            @keyup.enter="() => {searchFranchises();}"
            filled
            rounded
            clearable
          ></v-text-field>
        </v-col>
        
        <v-col cols="1">
          <v-btn block color="info" @click="dialog = true">
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </div>

    <v-simple-table>
      <template v-slot:default>
        <thead>
          <tr>
            <th class="text-left">
              id
            </th>
            <th class="text-left">
              Name
            </th>
            <th class="text-left">
              Nickname
            </th>
            <th class="text-left">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="item in franchises"
            :key="item.id"
          >
            <td> {{ item.id }} </td>
            <td>
              <span v-if="item.id != franchiseEdit.id"> {{ item.name }} </span>
              <span v-else><v-text-field label="Name" v-model="franchiseEdit.name" @keyup.enter="saveEdit" @keyup.esc="cancelEdit" autofocus></v-text-field></span>
            </td>
            <td>
              <span v-if="item.id != franchiseEdit.id"> {{ item.nickname }} </span>
              <span v-else><v-text-field label="Nickname" v-model="franchiseEdit.nickname" @keyup.enter="saveEdit" @keyup.esc="cancelEdit"></v-text-field></span>
            </td>
            <td>
              <v-btn
                v-if="item.id != franchiseEdit.id"
                @click="editFile(item)"
                color="info"
                icon
              >
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <div v-else class="button-container">
                <v-btn color="success" icon @click="saveEdit">
                  <v-icon>mdi-content-save </v-icon>
                </v-btn>
                <v-btn color="error" icon @click="cancelEdit">
                  <v-icon>mdi-close</v-icon>
                </v-btn>
              </div>
            </td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>

    <div class="text-center">
      <v-pagination
        v-model="page"
        :length="totalPages"
        :total-visible="7"
      ></v-pagination>
    </div>

    <v-dialog
      v-model="dialog"
      width="500"
    >
      <v-card>
        <v-card-title>Add new franchise</v-card-title>

        <v-card-text>
          <v-text-field label="Name" v-model="newName" autofocus></v-text-field>
          <v-text-field label="Nickname" v-model="newNickname"></v-text-field>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="success"
            @click="addFranchise"
            :disabled="newName.length == 0"
            :loading="creating"
          >
            Save
          </v-btn>
          <v-btn
            color="error"
            @click="dialog = false"
          >
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
  export default {
    name: 'Franchises',

    data() {
      return {
        name: '',
        timeOut: null,
        franchises: [],
        page: 1,
        totalPages: 1,
        dialog: false,
        franchiseEdit: {
          id: '',
          name: '',
          nickname: ''
        },
        newName: '',
        newNickname: '',
        creating: false
      }
    },

    created() {
      clearTimeout(this.timeOut);
      this.searchFranchises();
    },

    watch: {
      page(val) {
        this.searchFranchises();
      }
    },

    methods: {
      searchTime() {
        clearTimeout(this.timeOut);
        this.timeOut = setTimeout(() => this.searchFranchises(), 700);
      },

      async searchFranchises() {
        const response = await axios.get(`/franchises?name=${this.name}&page=${this.page}`);
        console.log(response);
        this.franchises = response.data.franchises;
        this.totalPages = response.data.totalPages;
      },

      editFile(data) {
        console.log(data);
        this.franchiseEdit = data;
      },

      cancelEdit() {
        this.franchiseEdit = {
          id: '',
          name: '',
          nickname: ''
        }
      },

      async saveEdit() {
        const data = { name: this.franchiseEdit.name, nickname: this.franchiseEdit.nickname };
        const response = await axios.put(`/franchises/${this.franchiseEdit.id}`, data);
        if (response.status == 200) {
          this.$store.dispatch('openAlert', { open: true, type: 'success', text: 'Franchise edit' });
          this.cancelEdit();
          this.searchFranchises();
        }
        else {
          this.$store.dispatch('openAlert', { open: true, type: 'error', text: `Franchise edit error: ${response.response.message}` });
        }
      },

      async addFranchise() {
        this.creating = true;
        const data = { name: this.newName, nickname: this.newNickname };
        const response = await axios.post('franchises/create', data);
        this.creating = false;
        if (response.status == 200) {
          this.$store.dispatch('openAlert', { open: true, type: 'success', text: 'Franchise create' });
          this.newName = '';
          this.newNickname = '';
          this.dialog = false;
          this.searchFranchises();
        } else {
          this.$store.dispatch('openAlert', { open: true, type: 'error', text: `Franchise crete error: ${response.response.message}` });
        }
      }
    }
  }
</script>