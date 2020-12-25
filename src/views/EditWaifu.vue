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

        <v-row>
          <v-col cols="6" class="mx-auto">
            <image-preview
              label="Image"
              :returnImage="previewImage"
              :imageDefault="imageDefaultUploadURL"
            />
          </v-col>

          <v-col cols="6">
            <image-preview
              label="Favorite Image"
              :returnImage="previewImageFav"
              :imageDefault="imageDefaultFavUploadURL"
            />
          </v-col>
        </v-row>

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

      <!-- <v-col cols="2" v-if="loadingData"></v-col> -->

      <v-col cols="2"></v-col>
    </v-row>
  </div>
</template>

<script>
  import ImagePreview from '../components/ImagePreview';
  export default {
    name: 'EditWaifu',

    components: { ImagePreview },

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
        imageDefaultUploadURL: '',
        imageDefaultNewURL: '',
        favImg: null,
        imageDefaultFavUploadURL: '',
        imageDefaultFavNewURL: '',
        saveChange: false,
        loadingData: true
      }
    },

    created() {
      this.id = this.$route.params.id;
      this.loadingData = true;
      this.fetchWaifu();
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
      async fetchWaifu() {
        const waifu = await axios.get(`/waifus/${this.id}`);
        // console.log(waifu.data);
        if (waifu.status != 200 || waifu.data.length == 0) return this.$router.push('/');

        const { data } = waifu;
        this.name = data.name;
        this.nickname = data.nickname;
        this.age = data.age;
        this.type = data.waifu_type_id;
        this.servant = data.servant;
        this.franchise = data.franchise_id;
        this.imageDefaultUploadURL = data.image_url;
        this.imageDefaultFavUploadURL = data.fav_image_url;

        this.fetchTypes(data.waifu_type_name);
        this.fetchFranchises(data.franchise_name);
        this.loadingData = false;
      },

      async fetchTypes (val) {
        this.loadingTypes = true;
        const result  = await axios.get(`/waifu_types`);
        // console.log(result.data);
        if ( result.status == 200 ) this.types = result.data.types;

        this.loadingTypes = false;
      },

      async fetchFranchises (val) {
        clearTimeout(this.timeOutFranchises);
        this.loadingFranchises = true;

        this.timeOutFranchises = setTimeout(async () => {
          const result  = await axios.get(`/franchises?name=${val}`);
          // console.log(result.data);
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
        formData.append('fav_img', this.favImg)
        console.log(formData);

        const response = await axios.put(`/waifus/${this.id}`, formData);
        this.saveChange = false;
        if (response.status == 200) {
          this.image = null;
          this.favImg = null;
          this.fetchWaifu();
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