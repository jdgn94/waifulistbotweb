<template>
  <div id="create-special">
    <v-row>
      <v-col cols="12" md="2"></v-col>

      <v-col cols="12" md="8">

        <autocomplete-component
          label="Franchise"
          url="franchises"
          pos="0"
          :changeValue="changeFranchise"
          :clearable="false"
          :clear="() => {}"
        />

        <v-row>
          <v-col cols="12" md="6">
            <div v-for="(waifu, index) in waifus" :key="index" class="one-line-container">
              <autocomplete-component
                label="Waifu"
                url="waifus"
                style="flex: 1; margin-right: 30px;"
                :pos="index"
                :changeValue="changeWaifu"
                :franchiseId="franchise"
                :clearable="false"
                :waifuId='waifu.id'
                :clear="() => {}"
              />

              <v-btn v-if="waifus.length > 2" color="error" @click="deleteItem(index)">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </div>
            <v-btn color="info" @click="addItem">
              Agregar <v-icon>mdi-plus</v-icon>
            </v-btn>
          </v-col>
          <v-col cols="12" md="6">
            <image-preview
              label="Image"
              :returnImage="changeImage"
              :imageDefault="''"
            />

            <v-btn
              block
              color="success"
              :disabled="disabledButtonSave"
              :loading="saving"
              @click="createImageSpecial"
            >
              save
            </v-btn>
          </v-col>
        </v-row>
      </v-col>

      <v-col cols="12" md="2"></v-col>
    </v-row>
  </div>
</template>

<script>
  import AutocompleteComponent from '../components/Autocomplete';
  import ImagePreview from '../components/ImagePreview.vue';

  export default {
    name: 'CreateSpecial',

    components: {
      AutocompleteComponent,
      ImagePreview,
    },

    data() {
      return {
        franchise: '',
        waifus: [
          { id: '' },
          { id: '' }
        ],
        image: null,
        saving: false
      };
    },

    computed: {
      disabledButtonSave() {
        let idVoid = false;
        this.waifus.map(waifu => { if (waifu.id == null || waifu.id == undefined || waifu.id == '') return idVoid = true });
        let image = this.image;
        return idVoid || !image;
      }
    },

    methods: {
      changeFranchise(val) {
        this.franchise = val;
      },

      changeWaifu(val, pos) {
        const waifus = this.waifus;
        waifus[pos].id = val;
        this.waifus = waifus;
      },

      addItem() {
        const waifus = this.waifus;
        waifus.push({ id: '' });
      },

      async deleteItem(index) {
        this.waifus.splice(index, 1);
      },

      changeImage(image) {
        this.image = image;
      },

      async createImageSpecial() {
        try {
          this.saving = true;
          let waifuIds = [];
          const waifus = this.waifus;
          await waifus.map(waifu => waifuIds.push(waifu.id));
          
          let formData = new FormData();
          formData.append('franchiseId', this.franchise);
          formData.append('waifuIds', waifuIds);
          formData.append('image', this.image);
          const { status, data } = await axios.post('/special_image/create', formData);
          if (status === 201) {
            this.waifus = [
              { id: '' },
              { id: '' }
            ];
            this.image = null;
            this.$store.dispatch('openAlert', { open: true, type: 'success', text: 'Image special created' });
          } else {
            this.$store.dispatch('openAlert', { open: true, type: 'error', text: `Error to save: ${response.response.message}` });
          }
          this.saving = false;
        } catch (error) {
          this.saving = false;
          this.$store.dispatch('openAlert', { open: true, type: 'error', text: `Error to save: ${error}` });
        }
      }
    }
  }
</script>