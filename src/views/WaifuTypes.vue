<template>
  <div id="waifu-types">
    <div class="search-bar" id="search-barr">
      <v-row>
        <v-col cols="11">
          <v-text-field
            label="Search"
            hint="search for name"
            v-model="name"
            @keyup="searchTime"
            @keyup.enter="() => {clearTimeout(this.timeOut); searchTypes()}"
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
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="item in types"
            :key="item.id"
          >
            <td> {{ item.id }} </td>
            <td>
              <span v-if="item.id != typeEdit.id"> {{ item.name }} </span>
              <span v-else><v-text-field label="Name" v-model="typeEdit.name" @keyup.enter="saveEdit" @keyup.esc="cancelEdit" autofocus></v-text-field></span>
            </td>
            <td>
              <v-btn
                v-if="item.id != typeEdit.id"
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
        <v-card-title>Add new waifu type</v-card-title>

        <v-card-text>
          <v-text-field label="Name" v-model="newName" autofocus></v-text-field>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="success"
            @click="addType"
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
  name: 'WaifuTypes',

  data() {
    return {
      name: '',
      page: 1,
      totalPages: 1,
      timeOut: null,
      types: [],
      typeEdit: {
        id: '',
        name: ''
      },
      dialog: false,
      newName: '',
      creating: false
    }
  },

  created() {
    this.searchTypes();
  },

  watch: {
    page(val) {
      this.searchTypes();
    }
  },

  methods: {
    async searchTypes () {
      const response = await axios.get(`/waifu_types?name=${this.name}&page=${this.page}`);
      console.log(response);
      this.types = response.data.types;
      this.totalPages = response.data.totalPages;
    },

    searchTime() {
      clearTimeout(this,timeOut);

      this.timeOut = setTimeout(() => this.searchTypes(), 700);
    },

    editFile(data) {
      this.typeEdit = { id: data.id, name: data.name }
    },
    
    async saveEdit() {
      const response = await axios.put(`/waifu_types/${this.typeEdit.id}`, { name: this.typeEdit.name });
      if (response.status == 200) {
        this.$store.dispatch('openAlert', { open: true, type: 'success', text: 'Waifu type edit' });
        this.cancelEdit();
        this.searchTypes();
      }
      else {
        this.$store.dispatch('openAlert', { open: true, type: 'error', text: `Waifu type edit error: ${response.response.message}` });
      }
    },

    cancelEdit() {
      this.typeEdit = {
        id: '',
        name: ''
      }
    },

    async addType() {
      this.creating = true;
      const response = await axios.post('/waifu_types/create', { name: this.newName });
      this.creating = false;
      if (response.status == 200) {
        this.$store.dispatch('openAlert', { open: true, type: 'success', text: 'Waifu type create' });
        this.newName = '';
        this.dialog = false;
        this.searchTypes();
      } else {
        this.$store.dispatch('openAlert', { open: true, type: 'error', text: `Waifu type crete error: ${response.response.message}` });
      }
    }
  }
}
</script>