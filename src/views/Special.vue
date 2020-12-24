<template>
  <div id="special-index">
    <v-row>
      <v-col cols="11">
        <v-text-field
          label="Search"
          hint="search for franchisen, name or nickname"
          v-model="name"
          @keyup.enter="fetchData(1, name)"
          @click:clear="resetSearch()"
          filled
          rounded
          clearable
        ></v-text-field>
      </v-col>
      
      <v-col cols="1">
        <router-link to='/special/create'>
          <v-btn block color="info">
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </router-link>
      </v-col>
    </v-row>

    <v-simple-table>
      <template v-slot:default>
        <thead>
          <tr>
            <th class="text-left">
              id
            </th>
            <th class="text-left">
              Image
            </th>
            <th class="text-left">
              Franchise
            </th>
            <th class="text-left">
              Quantity
            </th>
            <th class="text-left">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="item in specials"
            :key="item.id"
          >
            <td> {{ item.id }} </td>
            <td>
              <v-img
                style="margin: 5px;"
                max-height="150"
                max-width="70"
                :lazy-src="item.image_url"
                :src="item.image_url"
              />
            </td>
            <td>
              <span> {{ item.franchise }} </span>
            </td>
            <td>
              <span> {{ item.waifus_quantity }} </span>
            </td>
            <td>
              <v-btn
                icon
                color="info"
                @click="redirect(item.id)"
              >
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
            </td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>

    <div class="text-center">
      <v-pagination
        v-model="page"
        :length="totalPage"
        :total-visible="7"
      ></v-pagination>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Special',

    data() {
      return {
        name: '',
        specials: [],
        page: 1,
        totalPage: 1,
        timeOut: null
      }
    },

    created() {
      this.fetchData();
    },

    watch: {
      page(val) {
        console.log('cambie de pagina a la', val);
        this.fetchData(val);
      },

      name(val) {
        clearTimeout(this.timeOut);
        this.timeOut = setTimeout(() => {
          this.page = 1;
          this.fetchData(1, val);
        }, 700);
      }
    },

    methods: {
      async fetchData(page = 1, name = '') {
        clearTimeout(this.timeOut); 
        if (name == null) name = ''
        const { status, data } = await axios.get('/special_image/?page=' + page + '&name=' + name);
        console.log(data);
        if (status == 200) {
          this.specials = data.specials;
          this.totalPage = data.totalPage;
        }
      },

      resetSearch() {
        this.name = '';
        this.page = 1;
        this.fetchData();
      },

      redirect(id) {
        this.$router.push(`/special/${id}`);
      }
    }
  }
</script>