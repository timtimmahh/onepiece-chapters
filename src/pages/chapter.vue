<template>
  <q-page v-on:mouseover="onMouseOver" v-on:mousemove="onMouseOver" @click="onTouch">
    <q-card>
      <div ref="content">
        <q-img :src="content[page - 1]" />
        <q-page-sticky expand position="left">
          <div ref="left_button" style="height: 100%">
            <transition
              enter-active-class="animated fadeInLeft"
              leave-active-class="animated fadeOutLeft"
            >
              <q-btn
                v-show="reveal"
                flat
                icon="arrow_left"
                class="text-black"
                style="background: rgba(0, 0, 0, 0.35); height: 100%"
                :disable="page === content.length"
                @click="nextPage"
              />
            </transition>
          </div>
        </q-page-sticky>
        <q-page-sticky expand position="right">
          <div ref="right_button" style="height: 100%">
            <transition
              enter-active-class="animated fadeInRight"
              leave-active-class="animated fadeOutRight"
            >
              <q-btn
                v-show="reveal"
                flat
                icon="arrow_right"
                class="text-black"
                style="background: rgba(0, 0, 0, 0.35); height: 100%"
                :disable="page === 1"
                @click="previousPage"
              />
            </transition>
          </div>
        </q-page-sticky>
        <q-page-sticky expand position="bottom" :offset="[btnWidths[0], 0]">
          <div ref="page_slider" style="width: 100%">
            <transition
              enter-active-class="animated fadeInUp"
              leave-active-class="animated fadeOutDown"
            >
              <q-toolbar style="background: rgba(0, 0, 0, 0.35)" v-show="reveal">
                <q-slider
                  thumb-path="M5 5 h10 v10 h-10 v-10"
                  v-model="page"
                  :min="1"
                  :max="content.length"
                  :step="1"
                  reverse
                  snap
                  label
                  markers
                />
              </q-toolbar>
            </transition>
          </div>
        </q-page-sticky>
        <q-page-sticky
          position="bottom-right"
          :offset="[btnWidths[0] + 18, btnWidths[2] + 18]"
        >
          <div ref="btn_fullscreen">
            <transition
              enter-active-class="animated fadeIn"
              leave-active-class="animated fadeOut"
            >
              <q-btn
                round
                color="primary"
                @click="toggleFullscreen"
                :icon="$q.fullscreen.isActive ? 'fullscreen_exit' : 'fullscreen'"
                v-show="reveal"
              />
            </transition>
          </div>
        </q-page-sticky>
      </div>
    </q-card>
  </q-page>
</template>

<script>
export default {
  created() {
    this.windowHeight = window.innerHeight + "px";
  },
  mounted() {
    console.log(
      "FS Btn dims: " +
        [this.$refs.btn_fullscreen.clientHeight, this.$refs.btn_fullscreen.clientWidth]
    );
    this.btnWidths = [
      this.$refs.left_button.clientWidth,
      this.$refs.right_button.clientWidth,
      this.$refs.page_slider.clientHeight,
      this.$el.offsetTop,
      this.$refs.btn_fullscreen.clientWidth + 18,
    ];
    console.log(this.btnWidths);
    this.btn_hover = false;
  },
  data() {
    return {
      windowHeight: "0px",
      page: 1,
      fullscreen: false,
      draggingImg: false,
      btnWidths: [0, 0, 0],
      footerOffset: [0, 0],
      timeoutFcn: undefined,
    };
  },
  computed: {
    chapterTitle() {
      return this.$store.getters.getChapterTitle(this.$route.params.chapter);
    },
    content() {
      return this.$store.getters.getChapterContent(this.$route.params.chapter);
    },
    sliderOffset() {
      if (this.$refs.page_slider) {
        return (
          this.$refs.page_slider.offsetParent.offsetTop -
          (this.btnWidths[2] - this.$refs.page_slider.clientHeight)
        );
      }
      return this.btnWidths[2];
    },
    reveal: {
      get: function () {
        return this.$store.state.ui.reveal;
      },
      set: function (newValue) {
        this.$store.commit("setReveal", newValue);
      },
    },
  },
  methods: {
    nextPage() {
      if (this.page !== this.content.length) {
        this.page += 1;
      }
    },
    previousPage() {
      if (this.page !== 1) {
        this.page -= 1;
      }
    },
    goToPage(page) {
      this.page = page;
    },
    onMouseOver(event) {
      if (!this.$q.platform.is.mobile) {
        const x = event.clientX - this.$el.offsetLeft;
        this.reveal =
          x <= this.btnWidths[0] ||
          x >= this.$el.clientWidth - this.btnWidths[1] ||
          event.clientY <= this.btnWidths[3] ||
          event.clientY >= this.sliderOffset ||
          (event.clientY >= this.sliderOffset - this.btnWidths[4] &&
            x >= this.$el.clientWidth - this.btnWidths[1] - this.btnWidths[4]);
        // console.log({
        //   pageImg: this.$el,
        //   event: event,
        //   slider: this.$refs.page_slider,
        // });
      }
    },
    onTouch() {
      if (this.$q.platform.is.mobile) {
        if (this.timeoutFcn) {
          clearTimeout(this.timeoutFcn);
          this.timeoutFcn = undefined;
        }
        this.reveal = !this.reveal;
        if (this.reveal) {
          this.timeoutFcn = setTimeout(() => {
            this.reveal = false;
            this.timeoutFcn = undefined;
          }, 3000);
        }
      }
    },
    toggleFullscreen(e) {
      this.$q.fullscreen.toggle().then(() => {
        console.log(this.$q.fullscreen.isActive);
      });
    },
  },
};
</script>

<style lang="sass" scoped></style>
