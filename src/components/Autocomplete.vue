<template>
  <div id="autocomplete-component">
    <v-autocomplete
      v-model='id'
      :items='items'
      :loading='loading'
      :search-input.sync='searchText'
      :label='label'
      :clearable='clearable'
      item-text='name'
      item-value="id"
      cache-items
      @clear='clear'
    />
  </div>
</template>

<script>
  export default {
    name: 'AutocompleteComponet',

    data() {
      return {
        id: null,
        loading: false,
        items: [],
        timeout: null,
        searchText: '',
      };
    },

    props: ['changeValue', 'label', 'clearable', 'clear', 'url', 'pos', 'franchiseId', 'waifuId'],

    watch:{
      id (val) {
        this.changeValue(val, this.pos);
      },

      waifuId (val) {
        this.searchWaifu(val)
      },

      searchText(val) {
        this.loading = true;
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => this.searchInfo(val), 700);
      },

      franchiseId (val) {
        this.searchFranchise(val);
      }
    },

    methods: {
      async searchInfo(val) {
        const { url } = this
        let items = [];
        if (url == 'franchises') {
          const { status, data } = await axios.get(`/${url}?name=${val}`);
          await data.franchises.forEach(async item => {
            await items.push({ id: item.id, name: item.nickname.length > 0 ? `${item.name} - ${item.nickname}` : item.name });
          });
        } else if (url == 'waifus' && this.franchiseId > 0) {
          const { status, data } = await axios.get(`/${url}?name=${val}&franchise_id=${this.franchiseId}`);
          await data.waifus.forEach(async waifu => {
            await items.push({ id: waifu.id, name: waifu.nickname.length > 0 ? `${waifu.name} - ${waifu.nickname}` : waifu.name  })
          });
        } else return this.loading = false;

        this.items = items;
        this.loading = false;
      },

      async searchWaifu(id) {
        if (id == '' || id == null || id == undefined) {
          this.id = null;
          this.loading = false;
          this.items = [];
          this.timeout = null;
          this.searchText = '';
          return;
        }
        console.log("buscar a la waifu", id);
        let items = [];
        const { status, data } = await axios.get(`/${this.url}?id=${id}`);
        if (data.waifus) {
          await data.waifus.forEach(async waifu => {
            await items.push({ id: waifu.id, name: waifu.nickname.length > 0 ? `${waifu.name} - ${waifu.nickname}` : waifu.name  })
          });
          this.items = items;
          this.id = items[0].id;
        }
      },

      async searchFranchise(id) {
        if (id == '' || id == null || id == undefined) {
          this.id = null;
          this.loading = false;
          this.items = [];
          this.timeout = null;
          this.searchText = '';
          return;
        }

        let items = [];
        const { status, data } = await axios.get(`/${this.url}?id=${id}`);
        console.log(status, data);
        if (data.franchises) {
          await data.franchises.forEach(async franchise => {
            await items.push({ id: franchise.id, name: franchise.nickname.length > 0 ? `${franchise.name} - ${franchise.nickname}` : franchise.name });
          });
          this.items = items;
          this.id = items[0].id;
        }
      }
    }
  }
</script>