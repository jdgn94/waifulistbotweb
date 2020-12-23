<template>
  <div id="image-componet">
    <v-img
      ref="imageDefault"
      :src="imageURL.length > 0 ? imageURL : imageDefault"
      min-height="300"
      min-width="100%"
      max-width="100%"
      max-height="450"
      :lazy-src="imageDefault.length > 0 ? imageDefault : require('../assets/no-image.jpg')"
      style="border-radius: 15px"
    >
      <template v-slot:placeholder>
        <v-row
          class="fill-height ma-0"
          align="center"
          justify="center"
          v-if="imageDefault.length > 0"
        >
          <v-progress-circular
            indeterminate
            color="grey lighten-5"
          ></v-progress-circular>
        </v-row>
      </template>
    </v-img>
    
    <v-file-input
      accept="image/png, image/jpeg"
      :label="label"
      v-model="image"
      @change="previewImage"
    ></v-file-input>
  </div>
</template>

<script>
  export default {
    name: 'ImagePreview',

    data() {
      return {
        image: null,
        imageURL: ''
      }
    },

    props: {
      label: String,
      returnImage: Function,
      imageDefault: String,
    },

    methods: {
      previewImage() {
        this.imageURL = this.image ? URL.createObjectURL(this.image) : '';
        this.returnImage(this.image);
      }
    }
  }
</script>