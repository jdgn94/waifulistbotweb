<template>
  <div id="app-bar">
    <v-app-bar
      color="deep-purple accent-4"
      dark
    >
      <router-link to="/">
        <v-toolbar-title class="nav-bar-link">Waifu List API</v-toolbar-title>
      </router-link>

      <v-spacer></v-spacer>

      <router-link to="/create-waifu">
        <v-btn text>Add waifu</v-btn>
      </router-link>

      <router-link to="/franchises">
        <v-btn text>Franchise</v-btn>
      </router-link>

      <router-link to="/waifu-types">
        <v-btn text>waifu types</v-btn>
      </router-link>
    </v-app-bar>
  </div>
</template>

<script>
  export default {
    name: 'AppBar',
  }
</script>