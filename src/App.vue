<template>
  <v-app>
    <AppBar />
    <v-main>
      <v-container>
        <router-view />
      </v-container>
      <AlertApp />
    </v-main>
  </v-app>
</template>

<script>
  import AppBar from './components/AppBar';
  import AlertApp from './components/AlertApp'

  export default {
    name: 'App',

    components: {
      AppBar,
      AlertApp
    },

    data: () => ({
      //
    }),
  };
</script>
