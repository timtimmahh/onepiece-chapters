<template>
  <q-layout view="hHh lpR lFf" dark ref="pageContainer">
    <q-header reveal v-model="reveal" :reveal-offset="0" elevated>
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggle" />
        <q-btn dense flat round icon="home" to="/" v-if="$route.name !== 'Home'"/>
        <q-toolbar-title v-text="routeTitle" />
        <q-space />
        <q-btn flat round dense icon="more_vert">
          <q-menu fit anchor="bottom left" dark>
            <q-list>
              <q-item
                clickable
                v-for="(item, i) in info"
                :key="i"
                @click="() => showDialog(item.title, item.content)"
              >
                <q-item-section no-wrap v-text="item.title">
                  <!-- <q-item-label v-text="item.title" :lines="1" /> -->
                </q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer show-if-above v-model="drawer" side="left" bordered :width="140">
      <!-- drawer content -->
      <q-list>
        <q-item v-for="(item, i) in items" :key="i" :to="'/chapter/' + item.to" exact>
          <q-item-section v-text="item.title" />
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container >
      <router-view />
    </q-page-container>
  </q-layout>
  <!-- <v-app dark>
    <v-navigation-drawer v-model="drawer" width="140" clipped app>
      <v-list>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          router
          exact
        >
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar clipped-left fixed app>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <nuxt-link to="/">
        <v-toolbar-title> Home </v-toolbar-title>
      </nuxt-link>
      <v-spacer></v-spacer>
      <v-menu bottom left>
        <template v-slot:activator="{ on, attrs }">
          <v-btn dark icon v-bind="attrs" v-on="on">
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>
        <v-list>
          <dialog-wrapper
            v-for="(item, i) in info"
            :key="i"
            :title="item.title"
            :content="item.content"
          >
            <template v-slot:activator="{ on, open }">
              <v-list-item :key="i" @click="open()" v-on="on">
                <v-list-item-title v-text="item.title" />
              </v-list-item>
            </template>
          </dialog-wrapper>
        </v-list>
      </v-menu> -->
  <!-- <v-toolbar-title v-text="title" /> -->
  <!-- </v-app-bar>
    <v-main>
      <v-container>
        <nuxt />
      </v-container>
    </v-main>
  </v-app> -->
</template>

<script>
import DialogWrapper from "components/DialogWrapper.vue";
import { mapMutations, mapState } from 'vuex';

export default {
  /* components: {
    DialogWrapper,
  }, */
  beforeRouteUpdate(to, from, next) {
    if (to.path.startsWith('/chapter')) {
      this.drawer = false;
    }
    next();
  },
  data() {
    return {
    };
  },
  computed: {
    items: {
      get() {
        return this.$store.state.global.chapters;
      },
    },
    info: {
      get() {
        return this.$store.state.global.pages.filter(function (item) {
          return item.title !== "Intro" && item.title !== "Contact us";
        });
      },
    },
    drawer: {
      get: function() { return this.$store.state.ui.drawer; },
      set: function(newValue) { this.$store.commit('setDrawer', newValue); }
    },
    reveal: {
      get: function() { return this.$store.state.ui.reveal; },
      set: function(newValue) { this.$store.commit('setReveal', newValue); }
    },
    routeTitle: {
      get: function() { return this.getRouteTitle(this.$route) }
    }
  },
  methods: {
    showDialog(title, body) {
      body = body.replace('h3', 'h4').replace('h2', 'h3').replace('h1', 'h2');
      this.$q.dialog({
        component: DialogWrapper,
        parent: this,
        title: title,
        content: body,
        dark: true,
      });
    },
    getRouteTitle(to) {
      if (!to) {
        return 'Home'
      }
      if (to.name) {
        return to.name
      } else if (to.path.startsWith('/chapter')) {
        return this.$store.getters.getChapterTitle(to.params.chapter)
      }
      console.log({
        to: to
      })
    },
    ...mapMutations({
      toggle: 'toggleDrawer'
    })
  }
};
</script>
