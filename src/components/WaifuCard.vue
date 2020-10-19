<template>
  <v-card
    max-width="200"
  >
    <v-img
      max-width="200"
      max-height="250"
      :src="data.image_url"
      lazy-src="../assets/no-image.jpg"
    >
      <template v-slot:placeholder>
        <v-row
          class="fill-height ma-0"
          align="center"
          justify="center"
        >
          <v-progress-circular
            indeterminate
            color="grey lighten-5"
          ></v-progress-circular>
        </v-row>
      </template>
    </v-img>
    <v-card-text>
      Name: {{ data.name }}
      <br>
      Nickname: {{ data.nickname }}
      <br>
      <span>Franchise: {{ data.franchise_name }}</span>
      <br>
      Short: {{ data.franchise_nickname }}
    </v-card-text>
  </v-card>
</template>

<script>
  export default {
    name: 'WaifuCard',

    props: ['data']
  }
</script>