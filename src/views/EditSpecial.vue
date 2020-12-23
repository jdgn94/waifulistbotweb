<template>
  <div id="edit-special">
    <v-row>
      <v-col cols="12" md="2"></v-col>

      <v-col cols="12" md="8">
        <autocomplete-component
          label="Franchise"
          url="franchises"
          pos="0"
          :changeValue="changeFranchise"
          :franchiseId='franchise'
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
              :imageDefault="specialDefault.image_url || ''"
            />

            <v-btn
              block
              color="success"
              :disabled="disabledButtonSave"
              :loading="saving"
              @click="sendData"
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
    name: 'EditSpecial',

    components: {
      AutocompleteComponent,
      ImagePreview,
    },

    data() {
      return {
        id: null,
        franchise: '',
        waifus: [
          { id: '' },
          { id: '' },
          { id: '' },
          { id: '' },
          { id: '' }
        ],
        waifusDelete: [],
        image: null,
        saving: false,
        specialDefault: {},
        waifusDefault: [],
      }
    },

    created() {
      this.id = this.$route.params.id;
      this.fetchData();
    },

    computed: {
      disabledButtonSave() {
        let idVoid = false;
        this.waifus.map(waifu => { if (waifu.id == null || waifu.id == undefined || waifu.id == '') return idVoid = true });
        return idVoid;
      }
    },

    methods: {
      async fetchData() {
        const { status, data } = await axios.get(`/special_image/${this.id}`);
        console.log(status, data);
        console.log(data.special.franchise_id);
        if (status === 200) {
          this.franchise = data.special.franchise_id;
          this.specialDefault = data.special;
          this.waifusDefault = data.waifus;
          let waifus = [];
          await data.waifus.map(waifu => waifus.push({ id: waifu.waifu_id }));
          console.log(waifus);
          this.waifus = waifus;
        }
      },

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

      async sendData() {
        this.saving = true;
        let waifuIds = []
        this.waifus.map(waifu => waifuIds.push(waifu.id));
        const franchiseId = this.franchise;
        const body = {
          waifuIds,
          franchiseId,
          image: this.image,
          specialId: this.specialDefault.id
        }
        console.log(body);
        const { status, data } = await axios.post('/special_image/edit', body);
        this.saving = false;
      }
    }
  }
</script>