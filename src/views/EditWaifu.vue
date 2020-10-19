<template>
  <div id="edit-waifu">
    <v-row>
      <v-col cols="2"></v-col>

      <v-col cols="8">
        <v-text-field
          v-model="name"
          label="Name"
        ></v-text-field>

        <v-text-field
          v-model="nickname"
          label="Nickname"
        ></v-text-field>

        <v-text-field
          v-model="age"
          label="Age"
          type="number"
        ></v-text-field>

        <v-autocomplete
          v-model="type"
          :items="types"
          :loading="loadingTypes" 
          :search-input.sync="searchTypes"
          label="Type"
          item-text="name"
          item-value="id"
          clearable
        ></v-autocomplete>

        <v-checkbox
          v-model="servant"
          :label="`Servant: ${servant == 1 ? 'true' : 'false'}`"
        ></v-checkbox>

        <v-autocomplete
          v-model="franchise"
          :items="franchises"
          :loading="loadingFranchises" 
          :search-input.sync="searchFranchises"
          label="Franchise"
          item-text="name"
          item-value="id"
          clearable
        ></v-autocomplete>

        <v-file-input
          accept="image/png, image/jpeg"
          ref="image"
          label="Image"
          v-model="image"
        ></v-file-input>

        <v-btn
          color="primary"
          @click="updateWaifu"
          :disabled="name.length == 0 || age < 0 || type < 1 || franchise < 1"
          :loading="saveChange"
          block
        >
          updated
        </v-btn>
      </v-col>

      <v-col cols="2"></v-col>
    </v-row>
  </div>
</template>

<script>
  export default {
    name: 'EditWaifu',

    data() {
      return {
        name: '',
        nickname: '',
        age: 18,
        type: '',
        types: [],
        searchTypes: null,
        loadingTypes: false,
        timeOutTypes: null,
        servant: false,
        franchise: '',
        franchises: [],
        searchFranchises: null,
        loadingFranchises: false,
        timeOutFranchises: null,
        image: null,
        saveChange: false
      }
    },

    created() {
      this.id = this.$route.params.id;
      this.fetchWaifu();
    },

    watch: {
      searchTypes (val) {
        this.loadingTypes = true

        // Lazily load input items
        this.fetchTypes(val);
      },
      
      searchFranchises (val) {
        this.loadingFranchises = true

        // Lazily load input items
        this.fetchFranchises(val);
      },
    },

    methods: {
      async fetchWaifu() {
        const waifu = await axios.get(`/waifus/${this.id}`);
        console.log(waifu.data);
        if (waifu.status != 200 || waifu.data.length == 0) return this.$router.push('/');

        const { data } = waifu;
        this.name = data.name;
        this.nickname = data.nickname;
        this.age = data.age;
        this.type = data.waifu_type_id;
        this.servant = data.servant;
        this.franchise = data.franchise_id;

        this.fetchTypes(data.waifu_type_name);
        this.fetchFranchises(data.franchise_name);
      },

      async fetchTypes (val) {
        clearTimeout(this.timeOutTypes);
        this.loadingTypes = true;

        this.timeOutTypes = setTimeout(async () => {
          const result  = await axios.get(`/waifu_types?name=${val}`);
          console.log(result.data);
          if ( result.status == 200 ) this.types = result.data.types;

          this.loadingTypes = false;
        }, 700)
      },

      async fetchFranchises (val) {
        clearTimeout(this.timeOutFranchises);
        this.loadingFranchises = true;

        this.timeOutFranchises = setTimeout(async () => {
          const result  = await axios.get(`/franchises?name=${val}`);
          console.log(result.data);
          if ( result.status == 200 ) this.franchises = result.data.franchises;

          this.loadingFranchises = false;
        }, 700)
      },

      async updateWaifu() {
        this.saveChange = true;
        let formData = new FormData();
        formData.append('name', this.name);
        formData.append('nickname', this.nickname);
        formData.append('age', this.age);
        formData.append('waifu_type_id', this.type);
        formData.append('servant', this.servant);
        formData.append('franchise_id', this.franchise);
        formData.append('image', this.image);
        console.log(formData);

        const response = await axios.put(`/waifus/${this.id}`, formData);
        this.saveChange = false;
        if (response.status == 200) {
          this.fetchWaifu();
          this.$store.dispatch('openAlert', { open: true, type: 'success', text: 'Waifus save' });
        } else {
          this.$store.dispatch('openAlert', { open: true, type: 'error', text: `Error to save: ${response.response.message}` });
        }
      }
    }
  }
</script>