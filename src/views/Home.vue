<template>
  <div id="home">
    <div class="search-bar" id="search-barr">
      <v-text-field
        label="Search"
        hint="search for name, nickname, franchise, age and waifu type"
        v-model="name"
        @keyup="searchTime"
        @keyup.enter="() => {clearTimeout(this.timeOut); searchWaifus()}"
        @click:clear="resetSearch()"
        filled
        rounded
        clearable
      ></v-text-field>
    </div>

    <div v-if="!loading" class="card-container" id="card-container">
      <router-link
        class="card-container-item"
        v-for="(waifu, index) in waifus"
        :key="index"
        :to="{ path: `/edit-waifu/${waifu.id}` }"
      >
        <WaifuCard :data="waifu"/>
      </router-link>
    </div>

    <div v-else class="card-container" id="card-container-loading">
      <div class="card-container-item" v-for="item in 20" :key="item">
          <v-sheet>
            <v-skeleton-loader
              class="mx-auto"
              width="200"
              height="250"
              type="card"
            ></v-skeleton-loader>
          </v-sheet>
      </div>
    </div>

    <div class="text-center">
      <v-pagination
        v-model="page"
        :length="totalPages"
        :total-visible="7"
      ></v-pagination>
    </div>
  </div>
</template>

<script>
  import WaifuCard from '../components/WaifuCard';

  export default {
    name: 'Home',

    components: {
      WaifuCard
    },

    data() {
      return {
        name: '',
        waifus: [],
        page: 1,
        totalPages: 0,
        loading: true,
        timeOut: null
      }
    },

    created() {
      this.searchWaifus();
    },

    watch: {
      page (val) {
        this.searchWaifus()
      }
    },

    methods: {
      async searchWaifus() {
        this.loading = true;
        const response = await axios.get(`/waifus?name=${this.name}&page=${this.page}`);
        this.waifus = response.data.waifus;
        this.totalPages = response.data.totalPages;
        this.loading = false;
      },

      searchTime() {
        clearTimeout(this.timeOut);
        this.timeOut = setTimeout(() => {
          this.page = 1;
          this.searchWaifus();
        }, 700);
      },

      resetSearch() {
        this.name = '';
        this.page = 1;
        this.searchWaifus();
      }
    }
  }
</script>
