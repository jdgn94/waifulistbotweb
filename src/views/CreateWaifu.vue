<template>
  <div id="create-waifu">
    <v-row>
      <v-col cols="2"></v-col>
      
      <v-col cols="8">
        <v-text-field
          v-model="name"
          label="name"
          required
        ></v-text-field>

        <v-text-field
          v-model="nickname"
          label="nickname"
        ></v-text-field>

        <v-text-field
          v-model="age"
          label="age"
          type="number"
          required
        ></v-text-field>

        <v-select
          v-model="type"
          :items="types"
          :loading="loadingTypes"
          label="Type"
          item-text="name"
          item-value="id"
          clearable
        ></v-select>

        <v-checkbox
          v-model="servant"
          :label="`Servant: ${servant.toString()}`"
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
          cache-items
        ></v-autocomplete>

        <v-row>
          <v-col cols="6" class="mx-auto">
            <image-preview
              label="Image"
              :returnImage="previewImage"
              :imageDefault="''"
            />
          </v-col>

          <v-col cols="6">
            <image-preview
              label="Image Favorite"
              :returnImage="previewImageFav"
              :imageDefault="''"
            />
          </v-col>
        </v-row>

        <v-btn
          color="primary"
          @click="saveWaifu"
          :disabled="name.length == 0 || age < 0 || type < 1 || franchise < 1 || !image"
          :loading="saveChange"
          block
        >
          save
        </v-btn>
      </v-col>
      
      <v-col cols="2"></v-col>
    </v-row>
  </div>
</template>

<script>
  import ImagePreview from '../components/ImagePreview';
  export default {
    name: 'CreateWaifu',

    components: {
      ImagePreview,
    },

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
        imageURL: '',
        favImg: null,
        imageFavURL: '',
        saveChange: false
      }
    },

    created() {
      this.fetchTypes();
    },

    watch: {
      searchFranchises (val) {
        this.loadingFranchises = true

        // Lazily load input items
        this.fetchFranchises(val);
      },
    },

    methods: {
      async fetchTypes (val) {
        const result  = await axios.get(`/waifu_types`);
        console.log(result.data);
        if ( result.status == 200 ) this.types = result.data.types;

        this.loadingTypes = false;
      },

      async fetchFranchises (val) {
        clearTimeout(this.timeOutFranchises);

        this.timeOutFranchises = setTimeout(async () => {
          const result  = await axios.get(`/franchises?name=${val}`);
          console.log(result.data);
          if ( result.status == 200 ) this.franchises = result.data.franchises;

          this.loadingFranchises = false;
        }, 700)
      },

      async saveWaifu() {
        this.loading = true;
        this.saveChange = true
        let formData = new FormData();
        formData.append('name', this.name);
        formData.append('nickname', this.nickname);
        formData.append('age', this.age);
        formData.append('waifu_type_id', this.type);
        formData.append('servant', this.servant);
        formData.append('franchise_id', this.franchise);
        formData.append('image', this.image);
        formData.append('fav_img', this.favImg);
        console.log(formData);

        const response = await axios.post('/waifus/create', formData);
        this.loading = false;
        this.saveChange = false;
        if (response.status == 200) {
          this.name = '';
          this.nickname = '';
          this.age = 18;
          this.type = '';
          this.servant = false;
          this.image = null;
          this.favImg = null;
          this.$store.dispatch('openAlert', { open: true, type: 'success', text: 'Waifus save' });
        } else {
          this.$store.dispatch('openAlert', { open: true, type: 'error', text: `Error to save: ${response.response.message}` });
        }
      },

      previewImage(image) {
        this.image = image;
      },

      previewImageFav(image) {
        this.favImg = image;
      }
    }
  }
</script>
