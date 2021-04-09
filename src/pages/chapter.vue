<template>
  <q-page v-on:mouseover="onMouseOver" v-on:mousemove="onMouseOver" @click="onTouch">
    <q-card>
      <div ref="content">
        <countdown-timer
          v-if="isUpcoming"
          @start_callback="startCallBack('event started')"
          @end_callback="endCallBack('event ended')"
          :start-time="startTime"
          :end-time="endTime"
          :interval="1000"
          :start-label="'Available at'"
          :end-label="'in'"
          label-position="begin"
          :end-text="''"
          :day-txt="'days'"
          :hour-txt="'hours'"
          :minutes-txt="'minutes'"
          :seconds-txt="'seconds'"
          style="display: block; max-width: 100%; text-align: center"
        >
          <template slot="start-label" slot-scope="scope">
            <div
              v-if="
                scope.props.startLabel !== '' &&
                scope.props.tips &&
                scope.props.labelPosition === 'begin'
              "
              >{{ scope.props.startLabel }}:</div
            >
            <div
              v-if="
                scope.props.endLabel !== '' &&
                !scope.props.tips &&
                scope.props.labelPosition === 'begin'
              "
              >
              <h1>
              {{ scope.props.startLabel }}:<br>
              {{ upcomingDate }}
              </h1>
              </div>
          </template>

          <template slot="countdown" slot-scope="scope">
            <div style="display: inline-block; padding-right: 16px">
            <span style="font-size: 107px; font-weight: 300; line-height: 3.75rem;">{{ scope.props.days }}<br></span>
            {{ scope.props.dayTxt }}
            </div>
            <div style="display: inline-block; padding-right: 16px">
              <span style="font-size: 107px; font-weight: 300; line-height: 3.75rem;">{{ scope.props.hours }}<br></span>
              {{ scope.props.hourTxt }}
            </div>
            <div style="display: inline-block; padding-right: 16px">
            <span style="font-size: 107px; font-weight: 300; line-height: 3.75rem;">{{ scope.props.minutes }}<br></span>
            {{ scope.props.minutesTxt }}
            </div>
            <div style="display: inline-block">
            <span style="font-size: 107px; font-weight: 300; line-height: 3.75rem;">{{ scope.props.seconds }}<br></span>
            {{ scope.props.secondsTxt }}
            </div>

          </template>

          <template slot="end-label" slot-scope="scope">
            <h1
              v-if="
                scope.props.startLabel !== '' &&
                scope.props.tips &&
                scope.props.labelPosition === 'end'
              "
              >{{ scope.props.startLabel }}:</h1
            >
            <h1
              v-if="
                scope.props.endLabel !== '' &&
                !scope.props.tips &&
                scope.props.labelPosition === 'end'
              "
              >{{ scope.props.endLabel }}:</h1
            >
          </template>

          <template slot="end-text" slot-scope="scope">
            <span style="color: green">{{ scope.props.endText }}</span>
          </template>
        </countdown-timer>
        <q-img :src="content[page - 1]" />
        <q-page-sticky expand position="left">
          <div ref="left_button" style="height: 100%">
            <transition
              enter-active-class="animated fadeInLeft"
              leave-active-class="animated fadeOutLeft"
            >
              <q-btn
                v-show="!$q.platform.is.mobile && reveal"
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
                v-show="!$q.platform.is.mobile && reveal"
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
import CountdownTimer from "src/components/CountdownTimer.vue"
import { date } from 'quasar'

export default {
  components: { CountdownTimer },
  beforeCreate() {
    this.$store.dispatch('updateChapter', this.$route.params.chapter)
  },
  created() {
    this.windowHeight = window.innerHeight + "px";
  },
  mounted() {
    console.log(
      "FS Btn dims: " +
        [this.$refs.btn_fullscreen.clientHeight, this.$refs.btn_fullscreen.clientWidth]
    );
    console.log('This shows an update.');
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
    isUpcoming() {
      return this.$store.getters.getUpcomingDate(this.$route.params.chapter) !== undefined;
    },
    startTime() {
      return date.formatDate(Date.now(), 'YYYY-MM-DD HH:mm:ss');
    },
    endTime() {
      return date.formatDate(this.$store.getters.getUpcomingDate(this.$route.params.chapter), 'YYYY-MM-DD HH:mm:ss');
    },
    upcomingDate() {
      return date.formatDate(this.$store.getters.getUpcomingDate(this.$route.params.chapter), 'ddd MMMM DD, YYYY HH:mm:ss');
    },
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
    onTouch(event) {
      if (this.$q.platform.is.mobile) {
        if (this.timeoutFcn) {
          clearTimeout(this.timeoutFcn);
          this.timeoutFcn = undefined;
        }
        this.reveal = true;
        if (this.reveal) {
          this.timeoutFcn = setTimeout(() => {
            this.reveal = false;
            this.timeoutFcn = undefined;
          }, 1000);
        }
        if (event.clientX < event.target.clientWidth / 2) {
          this.nextPage();
        } else if (event.clientX > event.target.clientWidth / 2) {
          this.previousPage();
        }
      }
      console.log(event)
    },
    toggleFullscreen(e) {
      this.$q.fullscreen.toggle().then(() => {
        console.log(this.$q.fullscreen.isActive);
      });
    },
    startCallBack: function(x) {
      console.log(x);
    },
    endCallBack: function(x) {
      console.log(x);
    },
  },
};
</script>

<style lang="sass" scoped></style>
